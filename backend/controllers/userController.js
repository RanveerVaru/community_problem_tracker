import { z } from 'zod';
import { User } from '../models/userModel.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const signup = async (req, res) => {
    const { name, email, password, role } = req.body;

    const userSchema = z.object({
        name: z.string().min(3).max(25),
        email: z.string().email(),
        password: z.string().min(8).max(32)
    });

    const validateData = userSchema.safeParse(req.body);
    if(!validateData.success) {
        return res.status(400).json({success: false, message: validateData.error.issues.map(error => error.message)});
    }

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ success: false, message: 'User already exists!' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ name, email, password: hashedPassword, role: role || 'user' });
        await newUser.save();

        return res.status(201).json({
            success: true,
            message: 'User created successfully',
            user: { name: newUser.name, email: newUser.email }
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Error creating user: ' + error.message });
    }
};

export const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ success: false, message: 'Invalid email or password' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: 'Invalid email or password' });
        }

        const isAdmin = user.role === 'admin';
        const token = jwt.sign({ id: user._id , isAdmin : isAdmin }, process.env.JWT_SECRET_KEY, { expiresIn: '1d' });

        res.cookie('jwt', token, {
            expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
            httpOnly: true,
            sameSite: 'Strict',
        });

        return res.json({
            success: true,
            message: 'User logged in successfully',
            token,
            user: { name: user.name, email: user.email , role : user.role }
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Error logging in user: ' + error.message });
    }
};

export const logout = async (req, res) => {
    try {
        res.clearCookie('jwt', {
            httpOnly: true,
            sameSite: 'Strict',
        });
        return res.status(200).json({ success: true, message: 'User logged out successfully' });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Error logging out user: ' + error.message });
    }
};

export const getAllUsers = async (req , res) => {
    try {
        const user = req.user_token;
        if(user.isAdmin) {
        const users = await User.find().select('-password').sort({ createdAt: -1 });

        return res.status(200).json({ success: true, message: "Users fetched successfully", users });
        }else {
            return res.status(403).json({ success: false, message: 'Not authorized to view all users.' });
        }
      } catch (error) {
        return res.status(500).json({ success: false, message: 'Error fetching users: ' + error.message });
      }
}

export const deleteUser = async (req, res) => {
    try {
        const user = req.user_token;
        if(user.isAdmin) {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) {
          return res.status(404).json({ success: false, message: 'User not found.' });
        }
        return res.status(200).json({ success: true, message: 'User deleted successfully.' });
        }else {
          return res.status(403).json({ success: false, message: 'Not authorized to delete users' });
        }
      } catch (error) {
        return res.status(500).json({ success: false, message: 'Error deleting user: ' + error.message });
      }
}
