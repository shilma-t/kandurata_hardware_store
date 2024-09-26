import mongoose from 'mongoose';

export const connectDB = async () => {
    try {
        await mongoose.connect('mongodb+srv://shilma:powerPro123@cluster0.4mpkn.mongodb.net/kandurata_hardware');
        console.log("DB Connected");
    } catch (error) {
        console.error("DB Connection Error:", error);
        process.exit(1); // Exit process with failure
    }
}
