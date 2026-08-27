import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { addComment as addCommentService } from "../services/comment.service.js";

// 1. Add comment 
const addComment = asyncHandler(async (req, res) => {
  const { taskId } = req.params;
  const { content } = req.body;

  if (!content?.trim()) {
    throw new ApiError(400, "Comment content is required");
  }

  const comment = await addCommentService(
    taskId,
    "6a7725074b6d32df48ceb3a6",
    content
  );

  return res
    .status(201)
    .json(
      new ApiResponse(
        201,
        comment,
        "Comment added successfully"
      )
    );
});

export { addComment };