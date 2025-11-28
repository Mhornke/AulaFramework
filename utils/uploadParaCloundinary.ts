export const uploadParaCloudinary = async (
    file: { uri: string; name?: string; type?: string }
): Promise<string> => {

    console.log("📸 Iniciando upload para Cloudinary. Dados recebidos:", file);

    const formData = new FormData();

    // Nome seguro caso não venha do Expo/ImagePicker
    const safeName = file.name || `foto_${Date.now()}.jpg`;
    const safeType = file.type || "image/jpeg";

    // ====================== BASE64 ======================
    if (file.uri && file.uri.startsWith("data:image")) {
        console.log("🟣 Detectado Base64. Enviando string Base64 diretamente.");
        formData.append("file", file.uri);
    } 
    // ====================== FILE URI (REACT NATIVE) ======================
    else if (file.uri && file.uri.startsWith("file://")) {
        console.log("🟢 Detectado arquivo local (file://). Enviando como arquivo.");
        formData.append("file", {
            uri: file.uri,
            type: safeType,
            name: safeName,
        } as any);
    } 
    else {
        console.log("⚠ URl recebida não é Base64 nem file:// — valor recebido:", file.uri);
        throw new Error("Formato de imagem inválido para upload.");
    }

    formData.append("upload_preset", "pet_upload");


    // 🔍 DEBUG: INSPECIONAR O FORMDATA
    console.log("------ Conteúdo do FormData._parts ------");
    console.log(JSON.stringify((formData as any)._parts, null, 2));
    console.log("----------------------------------------");


    const CLOUDINARY_URL = "https://api.cloudinary.com/v1_1/dqyohnesd/image/upload";

    try {
        const response = await fetch(CLOUDINARY_URL, {
            method: "POST",
            body: formData,
        });

        const data = await response.json();

        if (!response.ok) {
            console.error("❌ Erro do Cloudinary:", data);
            throw new Error(data.error?.message || "Falha no upload");
        }

        console.log("✅ Upload bem-sucedido! URL:", data.secure_url);
        return data.secure_url;

    } catch (error) {
        console.error("🔥 ERRO no upload:", error);
        throw error;
    }
};
