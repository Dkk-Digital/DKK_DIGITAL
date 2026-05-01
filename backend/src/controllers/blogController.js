import Blog from '../models/Blog.js';
import cloudinary from '../config/cloudinary.js';

const uploadToCloudinary = (fileBuffer, folder) =>
  new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder },
      (error, result) => {
        if (error) {
          reject(error);
          return;
        }

        resolve(result);
      }
    );

    stream.end(fileBuffer);
  });

const parseTags = (tags) => {
  if (!tags) return [];

  if (Array.isArray(tags)) return tags.filter(Boolean);

  if (typeof tags === 'string') {
    return tags
      .split(',')
      .map((tag) => tag.trim())
      .filter(Boolean);
  }

  return [];
};

const parsePublished = (published) => {
  if (published === true || published === 'true') return true;
  if (published === false || published === 'false') return false;
  return Boolean(published);
};

export const createBlog = async (req, res) => {
  try {
    const { title, content, excerpt, category, tags, published } = req.body;

    if (!title || !content || !excerpt || !category) {
      return res.status(400).json({ success: false, message: 'Please provide all required fields' });
    }

    let image = null;

    if (req.file) {
      const uploadedImage = await uploadToCloudinary(req.file.buffer, 'dkk-digital/blogs');
      image = {
        url: uploadedImage.secure_url,
        publicId: uploadedImage.public_id,
      };
    }

    const blog = await Blog.create({
      title,
      content,
      excerpt,
      category,
      tags: parseTags(tags),
      image,
      author: req.user._id,
      published: parsePublished(published),
      publishedAt: parsePublished(published) ? Date.now() : null,
    });

    await blog.populate('author', 'name email');

    res.status(201).json({
      success: true,
      message: 'Blog created successfully',
      blog,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAllBlogs = async (req, res) => {
  try {
    const { published, category, search, startDate, endDate, sortBy } = req.query;
    let filter = {};

    // Published filter
    if (published === 'true') {
      filter.published = true;
    } else if (published === 'false') {
      filter.published = false;
    }

    // Category filter
    if (category) {
      filter.category = category;
    }

    // Search filter (full-text search in title, content, and tags)
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } },
        { tags: { $regex: search, $options: 'i' } },
      ];
    }

    // Date range filter
    if (startDate || endDate) {
      filter.publishedAt = {};
      if (startDate) {
        filter.publishedAt.$gte = new Date(startDate);
      }
      if (endDate) {
        const endDateObj = new Date(endDate);
        endDateObj.setHours(23, 59, 59, 999);
        filter.publishedAt.$lte = endDateObj;
      }
    }

    // Build sort object
    let sort = { publishedAt: -1 }; // Default: newest first
    if (sortBy) {
      switch (sortBy) {
        case 'title':
          sort = { title: 1 };
          break;
        case 'oldest':
          sort = { publishedAt: 1 };
          break;
        case 'recent':
          sort = { publishedAt: -1 };
          break;
        default:
          sort = { publishedAt: -1 };
      }
    }

    const blogs = await Blog.find(filter)
      .populate('author', 'name email')
      .sort(sort);

    res.status(200).json({
      success: true,
      count: blogs.length,
      blogs,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getBlogBySlug = async (req, res) => {
  try {
    const blog = await Blog.findOne({ slug: req.params.slug }).populate('author', 'name email');
    if (!blog) {
      return res.status(404).json({ success: false, message: 'Blog not found' });
    }

    // Increment views
    blog.views += 1;
    await blog.save();

    res.status(200).json({
      success: true,
      blog,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateBlog = async (req, res) => {
  try {
    const { title, content, excerpt, category, tags, published } = req.body;

    let blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ success: false, message: 'Blog not found' });
    }

    // Check authorization
    if (blog.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to update this blog' });
    }

    const updateData = {
      title,
      content,
      excerpt,
      category,
      tags: parseTags(tags),
      published: parsePublished(published),
      publishedAt: parsePublished(published) && !blog.publishedAt ? Date.now() : blog.publishedAt,
      updatedAt: Date.now(),
    };

    if (req.file) {
      if (blog.image?.publicId) {
        await cloudinary.uploader.destroy(blog.image.publicId);
      }

      const uploadedImage = await uploadToCloudinary(req.file.buffer, 'dkk-digital/blogs');
      updateData.image = {
        url: uploadedImage.secure_url,
        publicId: uploadedImage.public_id,
      };
    }

    blog = await Blog.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    });

    await blog.populate('author', 'name email');

    res.status(200).json({
      success: true,
      message: 'Blog updated successfully',
      blog,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ success: false, message: 'Blog not found' });
    }

    // Check authorization
    if (blog.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this blog' });
    }

    if (blog.image?.publicId) {
      await cloudinary.uploader.destroy(blog.image.publicId);
    }

    await Blog.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Blog deleted successfully',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
