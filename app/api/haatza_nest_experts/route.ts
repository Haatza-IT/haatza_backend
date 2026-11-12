import { NextRequest } from "next/server";
import { verifyAdminAuthorization } from "@/middleware/admin-auth";
import { nestExpertUpdateSchema } from "@/modules/user-master/user-master.schema";
import { UserMasterService } from "@/modules/user-master/user-master.service";
import { apiError, apiSuccess, formatZodErrors } from "@/utils/api-response";
import { handleDatabaseError } from "@/utils/api-error";
import { USER_MASTER_MESSAGES } from "@/modules/user-master/user-master.constants";

export async function POST(request: NextRequest) {
  // 1. Verify admin authorization
  const authError = verifyAdminAuthorization(request);
  if (authError) {
    return authError;
  }

  try {
    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return apiError(USER_MASTER_MESSAGES.INVALID_JSON, 400);
    }

    const validation = nestExpertUpdateSchema.safeParse(body);
    if (!validation.success) {
      return apiError(
        USER_MASTER_MESSAGES.VALIDATION_FAILED,
        400,
        formatZodErrors(validation.error)
      );
    }

    const result = await UserMasterService.updateNestExpertStatus(validation.data);
    if (result.notFound) {
      return apiError(USER_MASTER_MESSAGES.USER_NOT_FOUND, 404);
    }

    return apiSuccess(
      USER_MASTER_MESSAGES.NEST_EXPERT_UPDATED_SUCCESS,
      result.user,
      200
    );
  } catch (error) {
    const dbErr = handleDatabaseError(error);
    return apiError(dbErr.message, dbErr.status, dbErr.errors);
  }
}
