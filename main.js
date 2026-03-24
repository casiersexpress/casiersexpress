// ── i18n ──
const translations = {
  en: {
    'nav.services':              'Services',
    'nav.contact':               'Contact',
    'designer.title':             'Event Configurator',
    'designer.download':         'Download image',
    'designer.columns':          'Columns',
    'designer.rows':             'Rows',
    'designer.legend':           'Each unit: 15.5″ W × 18″ D × 73″ H · 5 compartments · 36″ aisles between row pairs',
    'designer.capacity_warning': 'Maximum capacity of 500 lockers reached.',
    'form.title':                'Request a Quote',
    'form.contact_name':         'Contact Name',
    'form.company':              'Company Name',
    'form.email':                'Email',
    'form.phone':                'Phone Number',
    'form.start_date':           'Start Date',
    'form.end_date':             'End Date',
    'form.address':              'Delivery Address',
    'form.charge_users':         'Do you charge clients?',
    'form.yes':                  'Yes',
    'form.no':                   'No',
    'form.charge_amount':        'If yes, how much per use?',
    'form.amount_error':         'Please enter a valid amount (e.g. 5.00)',
    'form.tent_required':        'Tent required?',
    'form.vinyl_required':       'Vinyl wrap required?',
    'form.logo':                 'Link to your logo (for the quote)',
    'form.description':          'Event Description',
    'form.note':                 'Note: quotes are generated within 24-48h.',
    'form.required_error':       'This field is required.',
    'form.email_error':          'Please enter a valid email address.',
    'form.date_error':           'End date must be after start date.',
    'footer.made':               'Made in Canada with love <3',
    'footer.rights':             'All rights reserved.',
    'form.preview':              'Preview my request',
    'form.preview_title':        'Request Summary',
    'form.preview_back':         'Back',
    'form.submit':               'Submit my request',
    'form.success':              'Thank you, your request has been sent. You will receive a response within 48 hours. If you don\'t hear from us, email us at soumissions@casiersexpress.com.',
  },
  fr: {
    'nav.services':              'Services',
    'nav.contact':               'Contact',
    'designer.title':             'Configurateur d\'événement',
    'designer.download':         'Télécharger l\'image',
    'designer.columns':          'Colonnes',
    'designer.rows':             'Rangées',
    'designer.legend':           'Chaque unité : 15,5″ L × 18″ P × 73″ H · 5 compartiments · allées de 36″ entre chaque paire',
    'designer.capacity_warning': 'Capacité maximale de 500 casiers atteinte.',
    'form.title':                'Demande de soumission',
    'form.contact_name':         'Nom de contact',
    'form.company':              'Nom de compagnie',
    'form.email':                'Courriel',
    'form.phone':                'Numéro de téléphone',
    'form.start_date':           'Date de début',
    'form.end_date':             'Date de fin',
    'form.address':              'Adresse de livraison',
    'form.charge_users':         'Chargez-vous les clients?',
    'form.yes':                  'Oui',
    'form.no':                   'Non',
    'form.charge_amount':        'Si oui, combien par utilisation?',
    'form.amount_error':         'Veuillez entrer un montant valide (ex: 5.00)',
    'form.tent_required':        'Tente requise?',
    'form.vinyl_required':       'Vinyl wrap requis?',
    'form.logo':                 'Lien vers votre logo (pour la soumission)',
    'form.description':          'Description de l\'événement',
    'form.note':                 'Notez : les soumissions sont générées en 24-48h.',
    'form.required_error':       'Ce champ est requis.',
    'form.email_error':          'Veuillez entrer une adresse courriel valide.',
    'form.date_error':           'La date de fin doit être après la date de début.',
    'footer.made':               'Fait au Canada avec amour <3',
    'footer.rights':             'Tous droits réservés.',
    'form.preview':              'Prévisualiser ma demande',
    'form.preview_title':        'Résumé de votre demande',
    'form.preview_back':         'Retour',
    'form.submit':               'Soumettre ma demande',
    'form.success':              'Merci, votre soumission a été envoyée. Vous allez recevoir une réponse d\'ici 48 heures. Si vous n\'entendez pas de nous, écrivez-nous à soumissions@casiersexpress.com.',
  }
};

function setLanguage(lang) {
  document.documentElement.lang = lang;
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.dataset.i18n;
    if (translations[lang]?.[key]) el.textContent = translations[lang][key];
  });
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.lang === lang);
  });
  localStorage.setItem('lang', lang);
}

// ── Hamburger ──
const hamburger = document.querySelector('.hamburger');
const navMenu   = document.querySelector('.nav-menu');

hamburger.addEventListener('click', () => {
  const isOpen = navMenu.classList.toggle('open');
  hamburger.setAttribute('aria-expanded', isOpen);
});

document.querySelectorAll('.nav-links a').forEach(link => {
  link.addEventListener('click', () => {
    navMenu.classList.remove('open');
    hamburger.setAttribute('aria-expanded', false);
  });
});

// ── Locker Designer ──
const LOCKER_W   = 15.5;  // inches wide
const LOCKER_D   = 18;    // inches deep
const LOCKER_H   = 73;    // inches tall
const STACKS     = 5;     // compartments per column
const AISLE_D    = 36;    // aisle between row pairs
const PAIR_SPAN  = 2 * LOCKER_D + AISLE_D;  // 72″ per back-to-back pair

const COL_MAX    = 12;
const ROW_MAX    = 10;
const LOCKER_MAX = 500;

// Tent sizes (inches): auto-select smallest that fits
const TENTS = [
  { w: 240, d: 120, en: "20' × 10' tent", fr: "tente 20' × 10'" },
  { w: 240, d: 240, en: "20' × 20' tent", fr: "tente 20' × 20'" },
  { w: 240, d: 480, en: "20' × 40' tent", fr: "tente 20' × 40'" },
];

let lockerCols = 2;
let lockerRows = 2;

const canvas          = document.getElementById('locker-canvas');
const ctx             = canvas.getContext('2d');
const colsValEl       = document.getElementById('cols-value');
const rowsValEl       = document.getElementById('rows-value');
const summaryLkrs     = document.getElementById('summary-lockers');
const summaryDims     = document.getElementById('summary-dims');
const summaryTent     = document.getElementById('summary-tent');
const capacityWarning = document.getElementById('capacity-warning');

// ── Projection ──
// View from front-left, slightly above.
// wx (width)  → right and slightly down
// wy (depth)  → upper-right, foreshortened  (depth recedes upper-right → right side visible)
// wz (height) → straight up
const WX_ANGLE = 8  * Math.PI / 180;
const WY_ANGLE = 55 * Math.PI / 180;
const WY_FORE  = 0.55;

const WX_CX =  Math.cos(WX_ANGLE);
const WX_CY =  Math.sin(WX_ANGLE);
const WY_CX =  Math.cos(WY_ANGLE) * WY_FORE;
const WY_CY = -Math.sin(WY_ANGLE) * WY_FORE;  // negative → depth goes up on screen

function iso(wx, wy, wz, scale, ox, oy) {
  return {
    x: ox + (wx * WX_CX + wy * WY_CX) * scale,
    y: oy + (wx * WX_CY + wy * WY_CY) * scale - wz * scale
  };
}

// Raw projection (no scale/offset) for bounding-box calculation
function rawProj(wx, wy, wz) {
  return {
    rx: wx * WX_CX + wy * WY_CX,
    ry: wx * WX_CY + wy * WY_CY - wz
  };
}

function drawFace(pts, fill, stroke, lineWidth = 0.8) {
  ctx.beginPath();
  ctx.moveTo(pts[0].x, pts[0].y);
  for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i].x, pts[i].y);
  ctx.closePath();
  ctx.fillStyle   = fill;
  ctx.strokeStyle = stroke;
  ctx.lineWidth   = lineWidth;
  ctx.fill();
  ctx.stroke();
}

function drawLine(a, b, stroke, lineWidth = 0.8) {
  ctx.beginPath();
  ctx.moveTo(a.x, a.y);
  ctx.lineTo(b.x, b.y);
  ctx.strokeStyle = stroke;
  ctx.lineWidth   = lineWidth;
  ctx.stroke();
}

// World Y for a given row index.
function getRowY(row) {
  const pair = Math.floor(row / 2);
  const pos  = row % 2;
  return pair * PAIR_SPAN + pos * LOCKER_D;
}

function getTotalDepth(numRows) {
  if (numRows === 0) return 0;
  return getRowY(numRows - 1) + LOCKER_D;
}

function getTent(lockersW, lockersD) {
  for (const t of TENTS) {
    if (lockersW <= t.w && lockersD <= t.d) return t;
  }
  return TENTS[TENTS.length - 1]; // largest fallback
}

function drawAisleFloor(aisleIdx, scale, ox, oy, xOff, yOff) {
  const y0 = yOff + aisleIdx * PAIR_SPAN + 2 * LOCKER_D;
  const y1 = y0 + AISLE_D;
  const x0 = xOff;
  const x1 = xOff + lockerCols * LOCKER_W;
  const p  = (x, y, z) => iso(x, y, z, scale, ox, oy);
  drawFace(
    [p(x0, y0, 0), p(x1, y0, 0), p(x1, y1, 0), p(x0, y1, 0)],
    '#dce8ee', '#b0c8d4'
  );
}

// facesBack = false → near face (y=y0) shows compartment doors (front row)
// facesBack = true  → near face (y=y0) is the plain back panel (back row)
function drawUnit(col, worldY, scale, ox, oy, facesBack, xOff, yOff, startNum) {
  const x0 = xOff + col * LOCKER_W;
  const y0 = yOff + worldY;
  const x1 = x0 + LOCKER_W;
  const y1 = y0 + LOCKER_D;
  const z1 = LOCKER_H;
  const p  = (x, y, z) => iso(x, y, z, scale, ox, oy);

  // ── Top face ──
  drawFace(
    [p(x0,y0,z1), p(x1,y0,z1), p(x1,y1,z1), p(x0,y1,z1)],
    '#a8d4d6', '#2d6265'
  );

  // ── Right side face (x = x1) — narrow strip visible from front-left ──
  drawFace(
    [p(x1,y0,0), p(x1,y1,0), p(x1,y1,z1), p(x1,y0,z1)],
    '#5a9095', '#254850'
  );
  for (let i = 1; i < STACKS; i++) {
    const z = (LOCKER_H / STACKS) * i;
    drawLine(p(x1, y0, z), p(x1, y1, z), '#1e3e44', 0.6);
  }

  // ── Near face (y = y0) ──
  if (facesBack) {
    // Back panel — plain, no doors
    drawFace(
      [p(x0,y0,0), p(x1,y0,0), p(x1,y0,z1), p(x0,y0,z1)],
      '#6a9da0', '#254850'
    );
    for (let i = 1; i < STACKS; i++) {
      const z = (LOCKER_H / STACKS) * i;
      drawLine(p(x0, y0, z), p(x1, y0, z), '#1e3e44', 0.5);
    }
  } else {
    // Front face with compartment doors
    drawFace(
      [p(x0,y0,0), p(x1,y0,0), p(x1,y0,z1), p(x0,y0,z1)],
      '#7eb8ba', '#254850'
    );
    for (let i = 1; i < STACKS; i++) {
      const z = (LOCKER_H / STACKS) * i;
      drawLine(p(x0, y0, z), p(x1, y0, z), '#254850');
    }
    // Compartment numbers
    const unitScreenW = LOCKER_W * WX_CX * scale;
    if (unitScreenW >= 8 && startNum != null) {
      const fontSize = Math.max(7, Math.min(14, unitScreenW * 0.4));
      ctx.font = `bold ${fontSize}px sans-serif`;
      ctx.fillStyle = '#1a3a3d';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      for (let i = 0; i < STACKS; i++) {
        const hz = (LOCKER_H / STACKS) * (i + 0.5);
        const hp = p(x0 + LOCKER_W * 0.5, y0, hz);
        ctx.fillText(startNum + (STACKS - 1 - i), hp.x, hp.y);
      }
    }
  }
}

function drawScene() {
  const wrap = canvas.parentElement;
  canvas.width  = wrap.clientWidth;
  canvas.height = Math.round(Math.min(600, Math.max(280, window.innerHeight * 0.55)));

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const pad     = 28;
  const lockersW = lockerCols * LOCKER_W;
  const lockersD = getTotalDepth(lockerRows);

  // Pick smallest tent that fits
  const tent = getTent(lockersW, lockersD);
  const tentW = tent.w;
  const tentD = tent.d;

  // Center lockers in tent
  const xOff = (tentW - lockersW) / 2;
  const yOff = (tentD - lockersD) / 2;

  // Compute bounding box from all relevant corners
  const corners = [
    // Tent floor corners
    rawProj(0, 0, 0),
    rawProj(tentW, 0, 0),
    rawProj(tentW, tentD, 0),
    rawProj(0, tentD, 0),
    // Locker top corners
    rawProj(xOff, yOff, LOCKER_H),
    rawProj(xOff + lockersW, yOff, LOCKER_H),
    rawProj(xOff + lockersW, yOff + lockersD, LOCKER_H),
    rawProj(xOff, yOff + lockersD, LOCKER_H),
  ];

  let minRx =  Infinity, maxRx = -Infinity;
  let minRy =  Infinity, maxRy = -Infinity;
  for (const c of corners) {
    if (c.rx < minRx) minRx = c.rx;
    if (c.rx > maxRx) maxRx = c.rx;
    if (c.ry < minRy) minRy = c.ry;
    if (c.ry > maxRy) maxRy = c.ry;
  }

  const screenW = maxRx - minRx;
  const screenH = maxRy - minRy;

  const scale = Math.min(
    (canvas.width  - 2 * pad) / screenW,
    (canvas.height - 2 * pad) / screenH
  );

  const ox = pad - minRx * scale;
  const oy = pad - minRy * scale;

  // ── Draw tent floor ──
  const p = (x, y, z) => iso(x, y, z, scale, ox, oy);
  drawFace(
    [p(0, 0, 0), p(tentW, 0, 0), p(tentW, tentD, 0), p(0, tentD, 0)],
    '#f5eed8', '#c8b888', 1.5
  );

  // ── Tent dimension labels on canvas ──
  ctx.save();
  ctx.font = `bold ${Math.max(10, Math.round(scale * 3.5))}px sans-serif`;
  ctx.fillStyle = '#9a8a60';
  ctx.textAlign = 'center';

  // Width label along front edge
  const wMid = p(tentW / 2, 0, 0);
  ctx.fillText(`${tent.w / 12}'`, wMid.x, wMid.y + Math.max(14, scale * 4));

  // Depth label along right edge
  const dA = p(tentW, 0, 0);
  const dB = p(tentW, tentD, 0);
  ctx.save();
  ctx.translate((dA.x + dB.x) / 2 + Math.max(12, scale * 3), (dA.y + dB.y) / 2);
  const edgeAngle = Math.atan2(dB.y - dA.y, dB.x - dA.x);
  ctx.rotate(edgeAngle);
  ctx.fillText(`${tent.d / 12}'`, 0, 0);
  ctx.restore();
  ctx.restore();

  // ── Painter's algorithm ──
  const numPairs = Math.ceil(lockerRows / 2);

  for (let pair = numPairs - 1; pair >= 0; pair--) {
    const row1 = pair * 2 + 1;
    const row0 = pair * 2;

    if (row1 < lockerRows) {
      const wy = getRowY(row1);
      for (let col = 0; col < lockerCols; col++) {
        const num = row1 * lockerCols * STACKS + col * STACKS + 1;
        drawUnit(col, wy, scale, ox, oy, true, xOff, yOff, num);
      }
    }

    {
      const wy = getRowY(row0);
      for (let col = 0; col < lockerCols; col++) {
        const num = row0 * lockerCols * STACKS + col * STACKS + 1;
        drawUnit(col, wy, scale, ox, oy, false, xOff, yOff, num);
      }
    }

    if (pair > 0) {
      drawAisleFloor(pair - 1, scale, ox, oy, xOff, yOff);
    }
  }

  // ── Floor range labels (at the right end of each row) ──
  const floorFontSize = Math.max(8, Math.min(14, scale * 3));
  ctx.font = `bold ${floorFontSize}px sans-serif`;
  ctx.fillStyle = '#6a5020';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';

  for (let row = 0; row < lockerRows; row++) {
    const rowStart = row * lockerCols * STACKS + 1;
    const rowEnd   = rowStart + lockerCols * STACKS - 1;
    const label = `${rowStart}–${rowEnd}`;

    const wy = getRowY(row);
    const labelX = xOff + lockerCols * LOCKER_W + 4;
    const labelY = yOff + wy + LOCKER_D / 2;
    const lp = iso(labelX, labelY, 0, scale, ox, oy);
    ctx.fillText(label, lp.x + 4, lp.y);
  }

  // ── Summary ──
  const total = lockerRows * lockerCols * STACKS;
  const lang  = document.documentElement.lang || 'en';

  summaryLkrs.textContent = lang === 'fr' ? `${total} casiers` : `${total} lockers`;

  const toFtIn = in_ => {
    const ft  = Math.floor(in_ / 12);
    const ins = +(in_ - ft * 12).toFixed(1);
    return `${ft}′ ${ins}″`;
  };
  summaryDims.textContent =
    `${toFtIn(lockersW)} × ${toFtIn(lockersD)} ${lang === 'fr' ? 'profondeur totale' : 'total depth'}`;
  summaryTent.textContent = lang === 'fr' ? tent.fr : tent.en;
}

function updateCounters() {
  colsValEl.textContent = lockerCols;
  rowsValEl.textContent = lockerRows;
  drawScene();
}

function totalLockers(cols, rows) {
  return cols * rows * STACKS;
}

function showCapacityWarning(show) {
  capacityWarning.hidden = !show;
}

// ── Stepper buttons ──
document.getElementById('cols-up').addEventListener('click', () => {
  if (lockerCols >= COL_MAX) return;
  lockerCols++;
  showCapacityWarning(totalLockers(lockerCols, lockerRows) > LOCKER_MAX);
  updateCounters();
});
document.getElementById('cols-down').addEventListener('click', () => {
  if (lockerCols > 1) {
    lockerCols--;
    showCapacityWarning(totalLockers(lockerCols, lockerRows) > LOCKER_MAX);
    updateCounters();
  }
});
document.getElementById('rows-up').addEventListener('click', () => {
  if (lockerRows >= ROW_MAX) return;
  if (totalLockers(lockerCols, lockerRows + 1) > LOCKER_MAX) {
    showCapacityWarning(true);
    return;
  }
  showCapacityWarning(false);
  lockerRows++;
  updateCounters();
});
document.getElementById('rows-down').addEventListener('click', () => {
  if (lockerRows > 1) {
    lockerRows--;
    showCapacityWarning(totalLockers(lockerCols, lockerRows) > LOCKER_MAX);
    updateCounters();
  }
});

window.addEventListener('resize', drawScene);

document.getElementById('download-render').addEventListener('click', () => {
  const link = document.createElement('a');
  link.download = 'casiers-express-layout.png';
  link.href = canvas.toDataURL('image/png');
  link.click();
});

// ── Quote Form ──
const quoteForm      = document.getElementById('quote-form');
const formSuccess    = document.getElementById('form-success');
const chargeSelect   = document.getElementById('f-charge');
const amountField    = document.getElementById('charge-amount-field');
const amountInput    = document.getElementById('f-amount');
const amountError    = document.getElementById('amount-error');

// Show/hide amount field based on dropdown
chargeSelect.addEventListener('change', () => {
  const show = chargeSelect.value === 'Oui';
  amountField.hidden = !show;
  if (!show) {
    amountInput.value = '';
    amountError.hidden = true;
    amountInput.classList.remove('input-invalid');
  }
});

// Validate dollar amount on input
const DOLLAR_RE = /^\d+(\.\d{0,2})?$/;

amountInput.addEventListener('input', () => {
  const val = amountInput.value.trim();
  if (val === '') {
    amountError.hidden = true;
    amountInput.classList.remove('input-invalid');
    return;
  }
  const valid = DOLLAR_RE.test(val);
  amountError.hidden = valid;
  amountInput.classList.toggle('input-invalid', !valid);
});

// Clear inline error when user starts typing/changing a required field
quoteForm.querySelectorAll('[required]').forEach(input => {
  const evt = input.tagName === 'TEXTAREA' ? 'input' : input.type === 'date' ? 'change' : 'input';
  input.addEventListener(evt, () => {
    const field = input.closest('.form-field');
    field.classList.remove('has-error');
    const errEl = field.querySelector('.field-required-error');
    if (errEl) errEl.remove();
  });
});

const previewOverlay = document.getElementById('form-preview');
const previewBody    = document.getElementById('preview-body');
const previewBack    = document.getElementById('preview-back');
const previewClose   = document.getElementById('preview-close');
const previewSubmit  = document.getElementById('preview-submit');

// Field labels for the preview (keyed by input name)
const previewLabels = {
  en: {
    contact_name:     'Contact Name',
    company:          'Company Name',
    email:            'Email',
    phone:            'Phone',
    start_date:       'Start Date',
    end_date:         'End Date',
    delivery_address: 'Delivery Address',
    charge_users:     'Charge clients?',
    charge_amount:    'Amount per use',
    tent_required:    'Tent required?',
    vinyl_required:   'Vinyl wrap required?',
    logo_url:         'Logo link',
    description:      'Event Description',
    locker_columns:   'Columns',
    locker_rows:      'Rows',
    locker_total:     'Total lockers',
    tent_size:        'Tent size',
  },
  fr: {
    contact_name:     'Nom de contact',
    company:          'Nom de compagnie',
    email:            'Courriel',
    phone:            'Téléphone',
    start_date:       'Date de début',
    end_date:         'Date de fin',
    delivery_address: 'Adresse de livraison',
    charge_users:     'Chargez-vous les clients?',
    charge_amount:    'Montant par utilisation',
    tent_required:    'Tente requise?',
    vinyl_required:   'Vinyl wrap requis?',
    logo_url:         'Lien du logo',
    description:      'Description de l\'événement',
    locker_columns:   'Colonnes',
    locker_rows:      'Rangées',
    locker_total:     'Total casiers',
    tent_size:        'Taille de tente',
  }
};

function validateForm() {
  const curLang = document.documentElement.lang || 'en';
  const errMsg = translations[curLang]?.['form.required_error'] || 'This field is required.';
  let firstInvalid = null;

  quoteForm.querySelectorAll('[required]').forEach(input => {
    const field = input.closest('.form-field');
    field.classList.remove('has-error');
    const prev = field.querySelector('.field-required-error');
    if (prev) prev.remove();

    if (!input.value.trim()) {
      field.classList.add('has-error');
      const msg = document.createElement('p');
      msg.className = 'field-required-error';
      msg.textContent = errMsg;
      field.appendChild(msg);
      if (!firstInvalid) firstInvalid = input;
    }
  });

  if (firstInvalid) {
    firstInvalid.focus();
    firstInvalid.scrollIntoView({ behavior: 'smooth', block: 'center' });
    return false;
  }

  // Validate email format
  const emailInput = document.getElementById('f-email');
  const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (emailInput.value.trim() && !EMAIL_RE.test(emailInput.value.trim())) {
    const emailField = emailInput.closest('.form-field');
    emailField.classList.add('has-error');
    const emailErrMsg = translations[curLang]?.['form.email_error'] || 'Please enter a valid email address.';
    const msg = document.createElement('p');
    msg.className = 'field-required-error';
    msg.textContent = emailErrMsg;
    emailField.appendChild(msg);
    emailInput.focus();
    emailInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
    return false;
  }

  // Validate end date is after start date
  const startInput = document.getElementById('f-start');
  const endInput = document.getElementById('f-end');
  if (startInput.value && endInput.value && endInput.value <= startInput.value) {
    const endField = endInput.closest('.form-field');
    endField.classList.add('has-error');
    const dateErrMsg = translations[curLang]?.['form.date_error'] || 'End date must be after start date.';
    const msg = document.createElement('p');
    msg.className = 'field-required-error';
    msg.textContent = dateErrMsg;
    endField.appendChild(msg);
    endInput.focus();
    endInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
    return false;
  }

  if (chargeSelect.value === 'Oui') {
    const val = amountInput.value.trim();
    if (!val || !DOLLAR_RE.test(val)) {
      amountError.hidden = false;
      amountInput.classList.add('input-invalid');
      amountInput.focus();
      return false;
    }
  }

  return true;
}

function injectLockerConfig() {
  document.getElementById('form-cols').value  = lockerCols;
  document.getElementById('form-rows').value  = lockerRows;
  document.getElementById('form-total').value = lockerRows * lockerCols * STACKS;
  const lw = lockerCols * LOCKER_W;
  const ld = getTotalDepth(lockerRows);
  const cl = document.documentElement.lang || 'en';
  const tentSelect = document.getElementById('f-tent');
  if (tentSelect && tentSelect.value === 'Non') {
    document.getElementById('form-tent').value = cl === 'fr' ? 'Non applicable' : 'N/A';
  } else {
    const t = getTent(lw, ld);
    document.getElementById('form-tent').value = cl === 'fr' ? t.fr : t.en;
  }

  // Capture canvas render as base64 PNG
  document.getElementById('form-render').value = canvas.toDataURL('image/png');
}

function showPreview() {
  const curLang = document.documentElement.lang || 'en';
  const labels = previewLabels[curLang] || previewLabels.en;

  injectLockerConfig();

  previewBody.innerHTML = '';
  const data = new FormData(quoteForm);

  for (const [name, value] of data.entries()) {
    if (!value.toString().trim()) continue;
    const label = labels[name] || name;
    const dt = document.createElement('dt');
    dt.textContent = label;
    const dd = document.createElement('dd');
    dd.textContent = name === 'charge_amount' ? `$${value}` : value;
    previewBody.appendChild(dt);
    previewBody.appendChild(dd);
  }

  previewOverlay.hidden = false;
  document.body.style.overflow = 'hidden';
}

function hidePreview() {
  previewOverlay.hidden = true;
  document.body.style.overflow = '';
}

// Constrain end date to be after start date
const startDateInput = document.getElementById('f-start');
const endDateInput   = document.getElementById('f-end');

startDateInput.addEventListener('change', () => {
  if (startDateInput.value) {
    const next = new Date(startDateInput.value);
    next.setDate(next.getDate() + 1);
    endDateInput.min = next.toISOString().split('T')[0];
    if (endDateInput.value && endDateInput.value <= startDateInput.value) {
      endDateInput.value = '';
    }
  } else {
    endDateInput.min = '';
  }
});

// Preview button (form submit triggers validation → preview)
quoteForm.addEventListener('submit', (e) => {
  e.preventDefault();
  if (validateForm()) showPreview();
});

previewBack.addEventListener('click', hidePreview);
previewClose.addEventListener('click', hidePreview);

// Close overlay on background click
previewOverlay.addEventListener('click', (e) => {
  if (e.target === previewOverlay) hidePreview();
});

// Actual submit from preview
previewSubmit.addEventListener('click', async () => {
  previewSubmit.disabled = true;

  const data = new FormData(quoteForm);
  const curLang = document.documentElement.lang || 'en';

  try {
    const res = await fetch('https://formspree.io/f/xvzwenbo', {
      method: 'POST',
      body: data,
      headers: { 'Accept': 'application/json' }
    });
    if (res.ok) {
      hidePreview();
      quoteForm.hidden   = true;
      formSuccess.hidden = false;
    } else {
      throw new Error('submit failed');
    }
  } catch {
    previewSubmit.disabled = false;
    alert(curLang === 'fr'
      ? 'Erreur lors de l\'envoi. Veuillez réessayer.'
      : 'Submission failed. Please try again.');
  }
});

// ── Init ──
document.querySelectorAll('.lang-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    setLanguage(btn.dataset.lang);
    drawScene();
  });
});

setLanguage(localStorage.getItem('lang') || 'en');
updateCounters();
document.getElementById('footer-year').textContent = new Date().getFullYear();
