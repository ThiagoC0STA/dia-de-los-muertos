/**
 * Cole este código em Extensões > Apps Script da planilha, salve e publique:
 * Implantar > Nova implantação > Tipo: App da Web
 *   - Executar como: Eu
 *   - Quem pode acessar: Qualquer pessoa
 * Copie a URL gerada (termina em /exec) para SHEET_WEBHOOK_URL no .env.local.
 */

var ABA = "Pré-venda";
var CABECALHO = ["Data", "Nome", "WhatsApp"];

function doPost(e) {
  try {
    var dados = JSON.parse(e.postData.contents);
    var nome = String(dados.nome || "").trim();
    var whatsapp = String(dados.whatsapp || "").trim();

    if (!nome || !whatsapp) {
      return json({ ok: false, error: "dados incompletos" });
    }

    var planilha = SpreadsheetApp.getActiveSpreadsheet();
    var aba = planilha.getSheetByName(ABA);
    if (!aba) {
      aba = planilha.insertSheet(ABA);
    }
    if (aba.getLastRow() === 0) {
      aba.appendRow(CABECALHO);
      aba.getRange(1, 1, 1, CABECALHO.length).setFontWeight("bold");
    }

    var quando = dados.data ? new Date(dados.data) : new Date();
    aba.appendRow([
      Utilities.formatDate(quando, "America/Sao_Paulo", "dd/MM/yyyy HH:mm"),
      nome,
      whatsapp,
    ]);

    return json({ ok: true });
  } catch (erro) {
    return json({ ok: false, error: String(erro) });
  }
}

function json(objeto) {
  return ContentService.createTextOutput(JSON.stringify(objeto)).setMimeType(
    ContentService.MimeType.JSON,
  );
}
