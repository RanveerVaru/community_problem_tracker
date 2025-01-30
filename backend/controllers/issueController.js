import { Issue } from '../models/issueModel.js';
import { v2 as cloudinary } from 'cloudinary';

export const createIssue = async (req, res) => {
  const { title, description, category, status, location } = req.body;

  if (!title || !description || !category || !location) {
    return res.status(400).json({ success: false, message: 'All fields are required.' });
  }

  try {
    const createdBy = req.user_token.id;
    // Check if images are provided
    if (!req.files || !req.files.images) {
      return res.status(400).json({ success: false, message: 'No images uploaded.' });
    }
    //req.files = {
    // "images": [
    //     {
    //         "name": "image1.jpg",
    //         "data": "<Buffer ...>",
    //         "size": 200000,
    //         "encoding": "7bit",
    //         "tempFilePath": "/tmp/image1.jpg",
    //         "mimetype": "image/jpeg",
    //         "md5": "hash1",
    //         "mv": [Function: mv],
    //         ....
    //     },]}

    // Convert single image upload to an array for consistency
    const images = Array.isArray(req.files.images) ? req.files.images : [req.files.images];

    // Validate image formats
    const allowedFormats = ['image/jpeg', 'image/png'];
    for (const image of images) {
      if (!allowedFormats.includes(image.mimetype)) {
        return res.status(400).json({
          success: false,
          message: `Invalid image format for ${image.name}. Only JPG and PNG are allowed.`,
        });
      }
    }

    // Upload images to Cloudinary
    const uploadedImages = [];
    for (const image of images) {
      const uploadResponse = await cloudinary.uploader.upload(image.tempFilePath, {
        folder: 'issues',
      });
      uploadedImages.push({
        public_id: uploadResponse.public_id,
        url: uploadResponse.secure_url,
      });
    }

    // Create the new issue
    const newIssue = new Issue({
      title,
      description,
      category,
      status: status || 'reported', // Default status
      createdBy,
      location: location || null, // Ensure location is handled properly
      images: uploadedImages, // Save the images array to the database
    });

    await newIssue.save();

    return res.status(201).json({
      success: true,
      message: 'Issue created successfully.',
      issue: newIssue,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error creating issue: ' + error.message,
    });
  }
};

export const getAllIssues = async (req, res) => {
    try {
        // Fetch issues sorted by createdAt in descending order (-1 for descending)
        const issues = await Issue.find().sort({ createdAt: -1 }).populate('createdBy', 'name');
        return res.status(200).json({ success: true, issues });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Error fetching issues: ' + error.message,
        });
    }
};

export const getIssueById = async (req, res) => {
    try {
        const issue = await Issue.findById(req.params.id);
        if (!issue) {
            return res.status(404).json({ success: false, message: 'Issue not found.' });
        }
        return res.status(200).json({ success: true, issue });
        
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Error fetching issue:'+ error.message,
        });
    }
}

export const getMyIssues = async (req, res) => {
    try {
        const userId = req.user_token.id || null; // Assuming req.user is available from authentication middleware

        const issues = await Issue.find({ createdBy: userId });

        if (!issues.length) {
            return res.status(200).json({ success: true, message: 'No issues found.', issues: [] });
        }

        return res.status(200).json({ success: true, issues });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Error fetching your issues: ' + error.message,
        });
    }
};


export const searchIssue = async (req, res) => {
    try {
        const { title } = req.query; // Get the search term from query params
        if (!title) {
            return res.status(400).json({
                success: false,
                message: 'Please provide a search term.',
            });
        }
        // Search for issues where the title matches the given search term (case-insensitive)
        const issues = await Issue.find({
            title: { $regex: title, $options: 'i' }, // 'i' makes it case-insensitive
        });

        return res.status(200).json({
            success: true,
            issues,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Error searching for issues: ' + error.message,
        });
    }
};


export const updateIssue = async (req, res) => {
    try {
        const user = req.user_token;
        // console.log("user updt isue" , user);
        if(user.isAdmin) {
            const issue = await Issue.findByIdAndUpdate(req.params.id, req.body, {new: true});
            if (!issue) {
                return res.status(404).json({ success: false, message: 'Issue not found.' });
            }
            return res.status(200).json({ success: true, issue });
        }else {
            return res.status(401).json({ success: false, message: 'Unauthorized.' });
        }
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
}

export const deleteIssue = async (req, res) => {
    try {
        const user = req.user_token; // Extract user info from token
        // console.log(user);
        const issue = await Issue.findById(req.params.id);
        if (!issue) {
            return res.status(404).json({ success: false, message: "Issue not found." });
        }

        // Check if the user is an admin or the owner of the issue
        if (user.isAdmin || issue.createdBy.toString() === user.id) {
            await Issue.findByIdAndDelete(req.params.id);
            return res.status(200).json({ success: true, message: "Issue deleted successfully." });
        } else {
            return res.status(403).json({ success: false, message: "Unauthorized. You can only delete your own issues." });
        }

    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};





