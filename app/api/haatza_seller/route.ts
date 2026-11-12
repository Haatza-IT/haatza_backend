import { NextRequest } from "next/server";
import { sellerRegistrationSchema } from "@/modules/user-master/user-master.schema";
import { UserMasterService } from "@/modules/user-master/user-master.service";
import { apiError, apiSuccess, formatZodErrors } from "@/utils/api-response";
import { handleDatabaseError } from "@/utils/api-error";
import { USER_MASTER_MESSAGES } from "@/modules/user-master/user-master.constants";

export async function POST(request: NextRequest) {
  try {
    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return apiError(USER_MASTER_MESSAGES.INVALID_JSON, 400);
    }

    const validation = sellerRegistrationSchema.safeParse(body);
    if (!validation.success) {
      return apiError(
        USER_MASTER_MESSAGES.VALIDATION_FAILED,
        400,
        formatZodErrors(validation.error)
      );
    }

    const result = await UserMasterService.registerSeller(validation.data);
    if (result.conflict) {
      return apiError(result.conflict.message, 409, [result.conflict]);
    }

    return apiSuccess(
      USER_MASTER_MESSAGES.SELLER_REGISTERED_SUCCESS,
      result.seller,
      201
    );
  } catch (error) {
    const dbErr = handleDatabaseError(error);
    return apiError(dbErr.message, dbErr.status, dbErr.errors);
  }
}
