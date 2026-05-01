    const images = {
        gallery: [
            { src: "bedrooms.webp", alt: "Monteurzimmer Schlafzimmer Gästehaus 22 Asten" },
            { src: "livingroom.webp", alt: "Wohnzimmer mit TV Gästehaus 22" },
            { src: "kitchen.webp", alt: "Voll ausgestattete Gemeinschaftsküche Asten" },
            { src: "bathroom.webp", alt: "Sauberes Badezimmer Gästehaus 22" }
        ]
    };

    // Sprache setzen und WhatsApp-Link aktualisieren
    function setLang(lang) {
        document.body.classList.toggle('lang-en', lang === 'en');
        document.getElementById('btn-de').classList.toggle('active', lang === 'de');
        document.getElementById('btn-en').classList.toggle('active', lang === 'en');

        const waLink = document.getElementById('whatsapp-link');
        if (waLink) {
            if (lang === 'en') {
                waLink.href = "https://wa.me/436801610618?text=Hello!%20I%20am%20interested%20in%20a%20room%20at%20G%C3%A4stehaus%2022.";
            } else {
                waLink.href = "https://wa.me/436801610618?text=Hallo!%20Ich%20h%C3%A4tte%20gerne%20Infos%20zu%20einem%20Zimmer%20im%20G%C3%A4stehaus%2022.";
            }
        }
    }

    // Standort erst bei Klick abfragen
    function calculateDistance() {
        const btn = document.getElementById('check-dist-btn');
        const info = document.getElementById('dist-info');

        if (!navigator.geolocation) {
            alert("Standort wird nicht unterstützt.");
            return;
        }

        btn.innerHTML = '<i data-lucide="loader-2" class="spin"></i> Berechne...';
        lucide.createIcons();

        navigator.geolocation.getCurrentPosition(pos => {
            const R = 6371;
            const dLat = (48.2163 - pos.coords.latitude) * Math.PI / 180;
            const dLon = (14.4144 - pos.coords.longitude) * Math.PI / 180;
            const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(pos.coords.latitude * Math.PI / 180) * Math.cos(48.2163 * Math.PI / 180) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
            const dist = R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
            
            btn.style.display = 'none';
            info.style.display = 'block';
            info.style.background = '#1a73e8'; // Kräftiges Blau
            info.style.color = '#ffffff';
            info.style.padding = '0.6rem';
            info.style.borderRadius = '8px';
            info.style.fontWeight = '600';
            info.style.textAlign = 'center';
            
            const isEn = document.body.classList.contains('lang-en');
            info.innerText = isEn ? `Only ${dist.toFixed(1)} km away from you!` : `Nur ${dist.toFixed(1)} km von dir entfernt!`;
        }, () => {
            btn.innerText = "Zugriff verweigert";
            btn.style.borderColor = "#dc3545";
            btn.style.color = "#dc3545";
        });
    }

    function toggleModal(id) {
        const m = document.getElementById('modal-' + id);
        m.style.display = (m.style.display === 'flex') ? 'none' : 'flex';
    }

    function closeModals(e) { if (e.target.classList.contains('modal')) e.target.style.display = 'none'; }

    document.addEventListener('DOMContentLoaded', () => {
        lucide.createIcons();
        setLang('de');

        // Galerie laden
        const container = document.getElementById('gallery-container');
        images.gallery.forEach(img => {
            const div = document.createElement('div');
            div.className = 'gallery-item';
            div.innerHTML = `<img src="${img.src}" alt="${img.alt}" loading="lazy">`;
            div.onclick = () => {
                document.getElementById('lightbox-img').src = img.src;
                document.getElementById('lightbox').style.display = 'flex';
            };
            container.appendChild(div);
        });

        // Event Listener für Entfernungs-Button
        const distBtn = document.getElementById('check-dist-btn');
        if(distBtn) distBtn.addEventListener('click', calculateDistance);

        // Namen im Impressum schützen
        ['data-as-772', 'data-as-772-en'].forEach(id => {
            const el = document.getElementById(id);
            if (el) el.innerText = "rentiehclA lraK".split('').reverse().join('');
        });
    });

    function openNavigation() {
        const addr = encodeURIComponent("Gästehaus 22, Eichenstraße 22, 4481 Asten");
        const url = /iPad|iPhone|iPod/.test(navigator.userAgent) ? `maps://maps.apple.com/?daddr=${addr}` : `https://www.google.com/maps/dir/?api=1&destination=${addr}`;
        window.open(url, '_blank');
    }
      // Beispiel-Zielkoordinaten (Eiffelturm, Paris)
    const TARGET_COORDS = {
        lat: 48.8584,
        lon: 2.2945
    };

    const btn = document.getElementById('distBtn');
    const resultDiv = document.getElementById('result');

    /**
     * Berechnet die Luftlinie zwischen zwei Punkten (Haversine-Formel)
     */
    function calculateHaversine(lat1, lon1, lat2, lon2) {
        const R = 6371; // Erdradius in Kilometern
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLon = (lon2 - lon1) * Math.PI / 180;
        
        const a = 
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c; 
    }

    function updateUI(message, isError = false) {
        resultDiv.innerHTML = isError ? `<span class="error">${message}</span>` : message;
    }

    btn.addEventListener('click', () => {
        if (!navigator.geolocation) {
            updateUI("Geolocation wird von deinem Browser nicht unterstützt.", true);
            return;
        }

        btn.disabled = true;
        updateUI("Standort wird ermittelt...");

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const userLat = position.coords.latitude;
                const userLon = position.coords.longitude;

                const distance = calculateHaversine(
                    userLat, 
                    userLon, 
                    TARGET_COORDS.lat, 
                    TARGET_COORDS.lon
                );

                updateUI(`Es sind ca. <strong>${distance.toFixed(2)} km</strong> (Luftlinie) bis zum Ziel.`);
                btn.disabled = false;
            },
            (error) => {
                btn.disabled = false;
                switch(error.code) {
                    case error.PERMISSION_DENIED:
                        updateUI("Zugriff auf Standort verweigert.", true);
                        break;
                    case error.POSITION_UNAVAILABLE:
                        updateUI("Standortinformationen sind nicht verfügbar.", true);
                        break;
                    case error.TIMEOUT:
                        updateUI("Zeitüberschreitung bei der Standortabfrage.", true);
                        break;
                    default:
                        updateUI("Ein unbekannter Fehler ist aufgetreten.", true);
                        break;
                }
            },
            {
                enableHighAccuracy: true,
                timeout: 5000,
                maximumAge: 0
            }
        );
    });