import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { addComment as addCommentService,
    getTaskComments as getTaskCommentsService,
    deleteComment as deleteCommentService
 } from "../services/comment.service.js";

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

// 2. Get TASKS 
const getTaskComments = asyncHandler(async(req,res)=>{
    const {taskId} = req.params

    const comment = await getTaskCommentsService(taskId, "6a7725074b6d32df48ceb3a6")

    return res
    .status(200)
    .json(
        new ApiResponse(200, comment, "Task Comments Fetched Successfully")
    )
})

// 3. Delete Comment 
const deleteComment = asyncHandler(async (req, res) => {
  const { commentId } = req.params;

  await deleteCommentService(
    commentId,
    "6a7725074b6d32df48ceb3a6"
  );

  return res
    .status(200)
    .json(
      new ApiResponse(
        200, null, "Comment deleted Successfully"
      )
    );
});

export { addComment, getTaskComments, deleteComment };