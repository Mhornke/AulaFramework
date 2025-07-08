

export const uploadParaCloudinary = async (
    file: { uri: string; name: string; type: string }
): Promise<string> => {

    console.log("Iniciando upload para Cloudinary. Dados recebidos:", file);

    const formData = new FormData();

    // ====================== LÓGICA CORRIGIDA ======================
    // Verificamos se a propriedade 'uri' dentro do objeto é uma string Base64.
    if (file && file.uri && file.uri.startsWith('data:image')) {
        // ✅ CORRETO: Se for, extraímos e enviamos APENAS a string Base64.
        console.log("URI em Base64 detectada. Enviando a string de dados diretamente.");
        formData.append('file', file.uri);
    } else {
        // Para outros casos (ex: uri é 'file://...'), tratamos como um arquivo normal.
        console.log("URI de arquivo detectada. Anexando como objeto de arquivo.");
        formData.append('file', {
            uri: file.uri,
            name: file.name,
            type: file.type,
        } as any);
    }

    // Adiciona o preset de upload (essencial para autenticação)
    formData.append('upload_preset', "pet_upload"); // ☜ Substitua
 
// ======================= LOG DE VERIFICAÇÃO (VERSÃO REACT NATIVE) =======================
console.log("--- Verificando o conteúdo interno do FormData (para debug) ---");
// ATENÇÃO: _parts é uma propriedade interna para fins de debug no React Native
// e não deve ser usada em código de produção.
// Usamos JSON.stringify para formatar a saída e torná-la legível.
console.log(JSON.stringify((formData as any)._parts, null, 2));
console.log("----------------------------------------------------------------------");
// ====================================================================================


    const CLOUDINARY_URL = `https://api.cloudinary.com/v1_1/dqyohnesd/image/upload`; // ☜ Substitua

    try {
        const response = await fetch(CLOUDINARY_URL, {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error("Erro retornado pelo Cloudinary:", errorData);
            throw new Error(`Falha no upload: ${errorData.error.message}`);
        }

        const data = await response.json();
        console.log("Upload para Cloudinary bem-sucedido! URL:", data.secure_url);
        return data.secure_url;

    } catch (error) {
        console.error("Erro na função de upload:", error);
        throw error;
    }
};