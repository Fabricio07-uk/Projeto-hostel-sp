import React, { useState, useRef } from "react";

function App() {
  const [formData, setFormData] = useState({
    nome: "",
    nascimento: "",
    cidade: "",
    genero: "",
    cidadania: "",
    telefone: "",
    email: "",
    documento: null,
    problemaSaude: "",
    entrada: "",
    saida: "",
    observacoes: "",
    autorizacaoImagem: "",
    assinatura: null,
  });

  const [preview, setPreview] = useState(null);
  const [previewType, setPreviewType] = useState(null);
  const canvasRef = useRef(null);

  // --- Atualiza campos do formulário
  const handleChange = (e) => {
    const { name, value, type, files } = e.target;

    if (type === "file") {
      const file = files[0];
      setFormData({ ...formData, [name]: file });

      if (file) {
        const fileURL = URL.createObjectURL(file);
        if (file.type.startsWith("image/")) {
          setPreview(fileURL);
          setPreviewType("image");
        } else if (file.type === "application/pdf") {
          setPreview(fileURL);
          setPreviewType("pdf");
        } else {
          setPreview(null);
          setPreviewType(null);
        }
      }
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  // --- Assinatura Digital
  const startDrawing = (e) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.beginPath();
    ctx.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
    canvas.isDrawing = true;
  };

  const draw = (e) => {
    if (!canvasRef.current.isDrawing) return;
    const ctx = canvasRef.current.getContext("2d");
    ctx.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
    ctx.stroke();
  };

  const stopDrawing = () => {
    const canvas = canvasRef.current;
    if (canvas.isDrawing) {
      canvas.isDrawing = false;
      setFormData({ ...formData, assinatura: canvas.toDataURL() });
    }
  };

  const clearSignature = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setFormData({ ...formData, assinatura: null });
  };

  // --- Envio do Formulário
  const handleSubmit = (e) => {
    e.preventDefault();

    if (formData.saida && formData.entrada && formData.saida < formData.entrada) {
      alert("A data de saída não pode ser antes da data de entrada!");
      return;
    }

    console.log("Dados enviados:", formData);

    // Aqui você faria a chamada para backend
    // fetch("http://localhost:8000/api/captador", { method: "POST", body: data });
  };

  return (
    <div style={{ maxWidth: "700px", margin: "0 auto", padding: "30px", background: "#fff", borderRadius: "10px", boxShadow: "0 0 10px rgba(0,0,0,0.1)" }}>
      <h2 style={{ textAlign: "center", marginBottom: "20px" }}>📋 Captador de Dados</h2>

      <form onSubmit={handleSubmit}>
        {/* Nome */}
        <div style={{ marginBottom: "15px" }}>
          <label><b>Nome Completo:</b></label>
          <input type="text" name="nome" value={formData.nome} onChange={handleChange} required style={{ width: "100%", padding: "10px" }} />
        </div>

        {/* Data de Nascimento */}
        <div style={{ marginBottom: "15px" }}>
          <label><b>Data de Nascimento:</b></label>
          <input type="date" name="nascimento" value={formData.nascimento} onChange={handleChange} required style={{ width: "100%", padding: "10px" }} />
        </div>

        {/* Cidade */}
        <div style={{ marginBottom: "15px" }}>
          <label><b>Cidade e Estado:</b></label>
          <input type="text" name="cidade" value={formData.cidade} onChange={handleChange} style={{ width: "100%", padding: "10px" }} />
        </div>

        {/* Gênero */}
        <div style={{ marginBottom: "15px" }}>
          <label><b>Gênero:</b></label><br />
          <input type="radio" name="genero" value="Feminino" onChange={handleChange} /> Feminino{" "}
          <input type="radio" name="genero" value="Masculino" onChange={handleChange} /> Masculino{" "}
          <input type="radio" name="genero" value="Outro" onChange={handleChange} /> Outro
        </div>

        {/* Problema de saúde */}
        <div style={{ marginBottom: "15px" }}>
          <label><b>Tem algum problema de saúde?</b></label><br />
          <input type="radio" name="problemaSaude" value="Sim" onChange={handleChange} /> Sim{" "}
          <input type="radio" name="problemaSaude" value="Não" onChange={handleChange} /> Não
        </div>

        {/* Entrada */}
        <div style={{ marginBottom: "15px" }}>
          <label><b>Data e Hora de Entrada:</b></label>
          <input type="datetime-local" name="entrada" value={formData.entrada} onChange={handleChange} required style={{ width: "100%", padding: "10px" }} />
        </div>

        {/* Saída */}
        <div style={{ marginBottom: "15px" }}>
          <label><b>Data e Hora de Saída:</b></label>
          <input type="datetime-local" name="saida" value={formData.saida} onChange={handleChange} required style={{ width: "100%", padding: "10px" }} />
        </div>

        {/* Observações */}
        <div style={{ marginBottom: "15px" }}>
          <label><b>Observações:</b></label>
          <textarea name="observacoes" value={formData.observacoes} onChange={handleChange} rows="3" style={{ width: "100%", padding: "10px" }}></textarea>
        </div>

        {/* Upload Documento */}
        <div style={{ marginBottom: "20px" }}>
          <label><b>Documento com Foto:</b></label><br />
          <input type="file" name="documento" accept="image/*,.pdf" onChange={handleChange} style={{ marginTop: "10px" }} />
        </div>

        {/* Pré-visualização */}
        {preview && (
          <div style={{ marginBottom: "20px" }}>
            <h4>Pré-visualização:</h4>
            {previewType === "image" ? (
              <img src={preview} alt="Pré-visualização" style={{ maxWidth: "100%", border: "1px solid #ccc" }} />
            ) : (
              <iframe src={preview} title="Pré-visualização PDF" width="100%" height="400px"></iframe>
            )}
          </div>
        )}

        {/* Termo */}
        <div style={{ marginBottom: "15px" }}>
          <label><b>Termo de cessão de uso de imagem e voz:</b></label><br />
          <input type="radio" name="autorizacaoImagem" value="Sim" onChange={handleChange} /> Sim{" "}
          <input type="radio" name="autorizacaoImagem" value="Não" onChange={handleChange} /> Não
        </div>

        {/* Assinatura */}
        <div style={{ marginBottom: "20px" }}>
          <label><b>Assinatura:</b></label><br />
          <canvas
            ref={canvasRef}
            width={500}
            height={150}
            style={{ border: "1px solid #000", display: "block", marginBottom: "10px" }}
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
          />
          <button type="button" onClick={clearSignature} style={{ padding: "8px 15px", background: "#ccc", border: "none", borderRadius: "5px" }}>
            Limpar Assinatura
          </button>
        </div>

        {/* Botão Enviar */}
        <button type="submit" style={{ padding: "12px", width: "100%", background: "#007bff", color: "#fff", border: "none", borderRadius: "5px", fontSize: "16px" }}>
          Enviar Dados
        </button>
      </form>
    </div>
  );
}

export default App;
