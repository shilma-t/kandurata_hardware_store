import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
    name: String,
    company_name: String,
    product_name: String,
    contact_number: Number,
    email: String
});

const UserModel = mongoose.model("users", UserSchema);
export default UserModel;
