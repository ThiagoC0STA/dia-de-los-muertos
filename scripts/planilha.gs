/**
 * Cole em Extensões > Apps Script DA PLANILHA e salve (Ctrl+S).
 * Precisa ser aberto por dentro da planilha: assim o script fica vinculado
 * a ela e não depende de digitar nenhum ID.
 *
 * IMPORTANTE ao atualizar o código: a URL /exec continua servindo a versão
 * antiga até você publicar de novo.
 *   Implantar > Gerenciar implantações > ícone de lápis >
 *   Versão: "Nova versão" > Implantar
 *
 * Na primeira publicação: Implantar > Nova implantação > App da Web,
 * Executar como "Eu", Quem pode acessar "Qualquer pessoa".
 */

var CABECALHO = ["Data", "Nome", "WhatsApp"];

function planilhaAlvo() {
  var planilha = SpreadsheetApp.getActiveSpreadsheet();
  if (!planilha) {
    throw new Error(
      "script nao vinculado a uma planilha: abra em Extensoes > Apps Script de dentro da planilha",
    );
  }
  return planilha;
}

function abaDestino() {
  // primeira aba, a mesma que aparece ao abrir a planilha
  var aba = planilhaAlvo().getSheets()[0];

  if (aba.getLastRow() === 0) {
    aba.appendRow(CABECALHO);
    aba.getRange(1, 1, 1, CABECALHO.length).setFontWeight("bold");
    aba.setFrozenRows(1);
  }
  return aba;
}

function doPost(e) {
  try {
    var dados = JSON.parse(e.postData.contents);
    var nome = String(dados.nome || "").trim();
    var whatsapp = String(dados.whatsapp || "").trim();

    if (!nome || !whatsapp) {
      return json({ ok: false, error: "dados incompletos" });
    }

    var quando = dados.data ? new Date(dados.data) : new Date();
    abaDestino().appendRow([
      Utilities.formatDate(quando, "America/Sao_Paulo", "dd/MM/yyyy HH:mm"),
      nome,
      whatsapp,
    ]);

    return json({ ok: true });
  } catch (erro) {
    return json({ ok: false, error: String(erro) });
  }
}

/** Abrir a URL /exec no navegador mostra onde os cadastros estão caindo. */
function doGet() {
  try {
    var planilha = planilhaAlvo();
    var aba = planilha.getSheets()[0];
    return json({
      ok: true,
      planilha: planilha.getName(),
      url: planilha.getUrl(),
      abas: planilha.getSheets().map(function (s) {
        return s.getName() + " (" + s.getLastRow() + " linhas)";
      }),
      gravandoEm: aba.getName(),
      cadastros: Math.max(0, aba.getLastRow() - 1),
    });
  } catch (erro) {
    return json({ ok: false, error: String(erro) });
  }
}

function json(objeto) {
  return ContentService.createTextOutput(JSON.stringify(objeto)).setMimeType(
    ContentService.MimeType.JSON,
  );
}
