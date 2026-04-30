import Service from '../models/Service.js';
import cloudinary from '../config/cloudinary.js';

const uploadToCloudinary = (fileBuffer, folder) =>
  new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
      },
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

const parseFeatures = (features) => {
  if (!features) {
    return [];
  }

  if (Array.isArray(features)) {
    return features.filter(Boolean);
  }

  if (typeof features === 'string') {
    return features
      .split(',')
      .map((feature) => feature.trim())
      .filter(Boolean);
  }

  return [];
};

export const createService = async (req, res) => {
  try {
    const { title, description, shortDescription, price, category } = req.body;
    const features = parseFeatures(req.body.features);
    let image = null;

    if (req.file) {
      const uploadedImage = await uploadToCloudinary(req.file.buffer, 'dkk-digital/services');
      image = {
        url: uploadedImage.secure_url,
        publicId: uploadedImage.public_id,
      };
    }

    const service = await Service.create({
      title,
      description,
      shortDescription,
      price,
      category,
      features,
      image,
      createdBy: req.user._id,
    });

    res.status(201).json({
      success: true,
      message: 'Service created successfully',
      service,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAllServices = async (req, res) => {
  try {
    const { category } = req.query;
    let filter = {};

    if (category) {
      filter.category = category;
    }

    const services = await Service.find(filter).populate('createdBy', 'name email');
    res.status(200).json({
      success: true,
      count: services.length,
      services,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getServiceById = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id).populate('createdBy', 'name email');
    if (!service) {
      return res.status(404).json({ success: false, message: 'Service not found' });
    }
    res.status(200).json({
      success: true,
      service,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateService = async (req, res) => {
  try {
    const { title, description, shortDescription, price, category } = req.body;
    const features = parseFeatures(req.body.features);

    let service = await Service.findById(req.params.id);
    if (!service) {
      return res.status(404).json({ success: false, message: 'Service not found' });
    }

    // Check authorization
    if (service.createdBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to update this service' });
    }

    const updateData = {
      title,
      description,
      shortDescription,
      price,
      category,
      features,
      updatedAt: Date.now(),
    };

    if (req.file) {
      if (service.image?.publicId) {
        await cloudinary.uploader.destroy(service.image.publicId);
      }

      const uploadedImage = await uploadToCloudinary(req.file.buffer, 'dkk-digital/services');
      updateData.image = {
        url: uploadedImage.secure_url,
        publicId: uploadedImage.public_id,
      };
    }

    service = await Service.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      message: 'Service updated successfully',
      service,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteService = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) {
      return res.status(404).json({ success: false, message: 'Service not found' });
    }

    // Check authorization
    if (service.createdBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this service' });
    }

    if (service.image?.publicId) {
      await cloudinary.uploader.destroy(service.image.publicId);
    }

    await Service.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Service deleted successfully',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
