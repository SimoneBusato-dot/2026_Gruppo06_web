/**
 * typography.js
 * Utility per la tipografia italiana.
 * Inserisce spazi non-divisibili (NBSP) dopo preposizioni, articoli e
 * congiunzioni italiane brevi, per evitare che vengano lasciati
 * in fondo a una riga prima dell'a-capo (vedove/orfane).
 */

const ITALIAN_PARTICLES = new RegExp(
  '\\b(' + [
    // Articoli
    'il','lo','la','i','gli','le','un','uno','una',
    // Preposizioni semplici
    'di','da','in','con','su','per','tra','fra','a','e','o',
    // Preposizioni articolate
    'del','dello','della','dei','degli','delle',
    'al','allo','alla','ai','agli','alle',
    'dal','dallo','dalla','dai','dagli','dalle',
    'nel','nello','nella','nei','negli','nelle',
    'sul','sullo','sulla','sui','sugli','sulle',
    'col','coi',
    // Congiunzioni e particelle
    'ma','ne','se','che','chi','come','quando','dove','dopo','anche',
    'non','piu','gia','solo','poi','quindi','pero',
    // Accenti ASCII (regex non supporta bene gli accenti con \b, usiamo varianti)
    'più','già','però','né',
    // Preposizioni con apostrofo (versioni senza apostrofo per regex)
    'ad','ed','od',
  ].join('|') +
  ')\\b\\s+',
  'gi'
);

/**
 * Percorre tutti i text node dentro un elemento DOM
 * e sostituisce lo spazio dopo le particelle italiane
 * con uno spazio non-divisibile (\u00A0).
 *
 * Funziona con contenuto misto (testo + <span>, <mark>, ecc.)
 * perché opera direttamente sui text node.
 *
 * DEVE essere chiamata PRIMA di SplitType, così il browser calcola
 * i line break con i NBSP già presenti, e SplitType cattura quelle
 * righe già corrette.
 *
 * @param {HTMLElement} element - L'elemento radice da processare
 */
export function fixItalianOrphans(element) {
  if (!element) return;

  const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT, null);

  const textNodes = [];
  let node;
  while ((node = walker.nextNode())) {
    textNodes.push(node);
  }

  for (const textNode of textNodes) {
    const original = textNode.textContent;
    const updated = original.replace(ITALIAN_PARTICLES, (match, particle) => {
      return particle + '\u00A0';
    });
    if (updated !== original) {
      textNode.textContent = updated;
    }
  }
}
