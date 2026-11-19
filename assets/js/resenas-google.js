/* Reseñas de Google Maps para la sección "Lo que dicen las familias" (Nosotros).
   Sin clave de API se muestra la tarjeta con enlaces a Google Maps.
   Para que aparezcan las reseñas reales: pega tu clave en GOOGLE_MAPS_API_KEY
   (Google Cloud > habilitar "Places API (New)" y "Maps JavaScript API", y restringir la clave a tu dominio). */
(function () {
  var GOOGLE_MAPS_API_KEY = '';
  var BUSQUEDA = 'Grupo Memorial Velagio Ixtapaluca';
  var UBICACION = { lat: 19.3159525, lng: -98.8725097 };
  var MAPS_URL = 'https://maps.app.goo.gl/DZxjMnzuPA7K3e7P9';

  if (!GOOGLE_MAPS_API_KEY) return;

  function estrellas(n) { n = Math.round(n || 0); return '★★★★★'.slice(0, n) + '☆☆☆☆☆'.slice(0, 5 - n); }
  function el(tag, cls, txt) { var e = document.createElement(tag); if (cls) e.className = cls; if (txt) e.textContent = txt; return e; }

  window.velagioResenas = async function () {
    try {
      var lib = await google.maps.importLibrary('places');
      var res = await lib.Place.searchByText({
        textQuery: BUSQUEDA, fields: ['id'], maxResultCount: 1,
        locationBias: { center: UBICACION, radius: 3000 }, language: 'es'
      });
      if (!res.places || !res.places.length) return;
      var place = res.places[0];
      await place.fetchFields({ fields: ['rating', 'userRatingCount', 'reviews', 'googleMapsURI'] });
      var wrap = document.querySelector('.testimonial-swiper .swiper-wrapper');
      var resumen = document.getElementById('google-resumen');
      if (!wrap || !place.reviews || !place.reviews.length) return;
      if (resumen && place.rating) resumen.textContent = place.rating.toFixed(1) + ' ' + estrellas(place.rating) + ' · ' + place.userRatingCount + ' reseñas en Google';
      wrap.innerHTML = '';
      place.reviews.forEach(function (r) {
        var s = el('div', 'swiper-slide text-center px-md-5');
        var a = r.authorAttribution || {};
        if (a.photoURI) { var img = el('img', 'rounded-circle mb-3'); img.src = a.photoURI; img.width = 90; img.height = 90; img.alt = ''; img.referrerPolicy = 'no-referrer'; s.appendChild(img); }
        s.appendChild(el('div', 'mb-2', estrellas(r.rating))).style.color = '#c9a35b';
        s.appendChild(el('p', 'fs-5 fst-italic', '“' + (r.text || '') + '”'));
        s.appendChild(el('h6', 'mt-3 mb-0', a.displayName || ''));
        s.appendChild(el('small', 'text-muted', r.relativePublishTimeDescription || ''));
        wrap.appendChild(s);
      });
      var sw = document.querySelector('.testimonial-swiper').swiper;
      if (sw) { sw.update(); sw.slideTo(0); }
    } catch (e) { console.warn('Reseñas de Google no disponibles:', e); }
  };

  window.addEventListener('load', function () {
    var s = document.createElement('script');
    s.async = true;
    s.src = 'https://maps.googleapis.com/maps/api/js?key=' + encodeURIComponent(GOOGLE_MAPS_API_KEY) + '&v=weekly&loading=async&callback=velagioResenas';
    document.head.appendChild(s);
  });
})();
