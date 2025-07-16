// parseIdTokenFromHardcoded.js

function parseIdToken(idToken) {
  try {
    const parts = idToken.split('.');
    if (parts.length !== 3) {
      throw new Error('Invalid JWT format');
    }

    const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = Buffer.from(base64, 'base64').toString('utf-8');
    const payload = JSON.parse(jsonPayload);

    console.log('✅ Parsed idToken payload:');
    console.log('----------------------------');
    console.log(`👤 email     : ${payload.email}`);
    console.log(`🎯 audience  : ${payload.aud}`);
    console.log(`🆔 subject   : ${payload.sub}`);
    console.log(`🔏 issuer    : ${payload.iss}`);
    console.log(`📅 issued at : ${new Date(payload.iat * 1000).toISOString()}`);
    console.log(`⌛ expires   : ${new Date(payload.exp * 1000).toISOString()}`);
    console.log('----------------------------');

    return payload;
  } catch (err) {
    console.error('❌ Failed to parse idToken:', err.message);
  }
}

// 🔽 여기 idToken을 넣어주세요 ('' 안에 토큰 전체)
const hardcodedIdToken = `
      eyJhbGciOiJSUzI1NiIsImtpZCI6ImE4ZGY2MmQzYTBhNDRlM2RmY2RjYWZjNmRhMTM4Mzc3NDU5ZjliMDEiLCJ0eXAiOiJKV1QifQ
      .eyJpc3MiOiJodHRwczovL3NlY3VyZXRva2VuLmdvb2dsZS5jb20vd2VwaW4tcHJvZCIsImF1ZCI6IndlcGluLXByb2QiLCJhdXRoX3RpbWUiOjE3NTI2NDM5MTYsInVzZXJfaWQiOiIxMDM1NzkwMzYxMjUxNzM4NDcyNjYiLCJzdWIiOiIxMDM1NzkwMzYxMjUxNzM4NDcyNjYiLCJpYXQiOjE3NTI2NDM5MTYsImV4cCI6MTc1MjY0NzUxNiwiZW1haWwiOiJhMDEwOTI4MTMwMDdAZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsImZpcmViYXNlIjp7ImlkZW50aXRpZXMiOnsiZW1haWwiOlsiYTAxMDkyODEzMDA3QGdtYWlsLmNvbSJdfSwic2lnbl9pbl9wcm92aWRlciI6ImN1c3RvbSJ9fQ
      .Io7gZqKJMJgh_paS_I08m-k-wQycfV-eH31376UObBpa2Z9xso6pTcn9EuLRkABBm93X-Sf6YXMm6kyrBLeoIdpO4hZYQZYcM31VoCGbFiTP_Kv1cU0hO2PrQNBFpRGAcT2ZC0-A8JkSrzflvfr78zxhcB3aMpf8uydyOxrw1U60NqQAQZPNAMlXsA51aAY_ASvnI8TRIwEUDEL2WbeK7p8Nc33bgsqqOe28XXAE8EodNvIoGVk5HAc6ues3B-APsIZfrN9-w0Qo75QN6mUtEZVUUcN9U1_MtPAw_e6tH8K0ZrsVZUBG7LNYt2GOG7XC8gjlVn4QgtFZVsNHnfERPA
      `.replace(/\n/g, ''); // 줄바꿈 제거

parseIdToken(hardcodedIdToken);
