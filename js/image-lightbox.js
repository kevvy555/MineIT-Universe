export function installImageLightbox() {
  if (document.getElementById('imageLightbox')) return document.getElementById('imageLightbox');

  const overlay = document.createElement('div');
  overlay.id = 'imageLightbox';
  overlay.className = 'imageLightbox';
  overlay.hidden = true;
  overlay.innerHTML = `
    <div class="imageLightboxPanel" role="dialog" aria-modal="true" aria-labelledby="imageLightboxCaption">
      <button type="button" class="imageLightboxClose" aria-label="Close image">Close</button>
      <img class="imageLightboxImage" alt="">
      <p class="imageLightboxCaption" id="imageLightboxCaption"></p>
    </div>
  `;
  document.body.appendChild(overlay);

  const img = overlay.querySelector('.imageLightboxImage');
  const caption = overlay.querySelector('.imageLightboxCaption');
  const close = () => {
    overlay.hidden = true;
    img.removeAttribute('src');
    document.body.classList.remove('lightboxOpen');
  };

  overlay.addEventListener('click', event => {
    if (event.target === overlay) close();
  });
  overlay.querySelector('.imageLightboxClose').addEventListener('click', close);
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && !overlay.hidden) close();
  });

  overlay._open = ({ previewUrl, originalUrl, name }) => {
    caption.textContent = name || '';
    img.alt = name || '';
    img.src = originalUrl || previewUrl;
    img.onerror = () => {
      if (previewUrl && img.src !== previewUrl) img.src = previewUrl;
    };
    overlay.hidden = false;
    document.body.classList.add('lightboxOpen');
    overlay.querySelector('.imageLightboxClose').focus();
  };

  return overlay;
}

export function bindOriginalImageOpener(root, selector = '[data-original-image]') {
  const overlay = installImageLightbox();
  root.addEventListener('click', event => {
    const trigger = event.target.closest(selector);
    if (!trigger) return;
    event.preventDefault();
    overlay._open({
      previewUrl: trigger.dataset.previewImage,
      originalUrl: trigger.dataset.originalImage,
      name: trigger.dataset.imageName
    });
  });
}
