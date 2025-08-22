// 업로드 관련 타입들을 정의하는 파일

// ===== 이미지 업로드 관련 타입 =====

/**
 * 이미지 업로드 요청 타입
 * - 포스트 작성 시 이미지 파일을 서버로 전송
 */
export interface ImageUploadRequest {
  image: File;
}

/**
 * 이미지 업로드 응답 타입
 * - 업로드 성공 시 서버에서 반환하는 정보
 */
export interface ImageUploadResponse {
  success: boolean;
  imageUrl: string; // 업로드된 이미지의 URL
  tempImageId: number; // 임시 이미지 ID (포스트 저장 시 사용)
}
