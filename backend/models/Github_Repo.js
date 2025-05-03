const mongoose = require("mongoose");

const GithubRepoSchema = mongoose.Schema({
    repo_id: {
        type: Number,
        unique: true,
        required: [true, "Github Repo ID must be provided"]
    },
    repo_name: {
        type: String,
        required: [true, "Repo Name must be provided"]
    },
    repo_api_url: {
        type: String,
        unique: true,
        required: [true, "Repo API Url must be provided"]
    },
    repo_analysis: {
        type: String,
        default: ""
    }
}, { timestamps: true });

module.exports = mongoose.model("Github_Repo", GithubRepoSchema);