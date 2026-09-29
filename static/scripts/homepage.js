function smoothScroll(targetId) {
    var target = document.getElementById(targetId);
    if (!target) return;
    var navbar = document.querySelector('.navbar');
    var offset = (navbar ? navbar.offsetHeight : 0) + 10;
    var top = target.getBoundingClientRect().top + window.pageYOffset - offset;
    window.scrollTo({ top: top, behavior: 'smooth' });
}

/* ---------- Lightbox (galéria + poukážky) ---------- */

var modal = document.getElementById('myModal');
var modalImg = document.getElementById('img01');

function openBiggerImage(photoSrc) {
    modalImg.src = photoSrc;
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    modal.classList.remove('open');
    document.body.style.overflow = '';
}

modal.addEventListener('click', function(event) {
    if (event.target === modal) {
        closeModal();
    }
});

document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        closeModal();
    }
});

/* ---------- Scroll-reveal animácie ---------- */
/* Trieda "reveal-ready" na <html> zaručí, že bez JS ostane všetko viditeľné. */

document.documentElement.classList.add('reveal-ready');

document.addEventListener('DOMContentLoaded', function() {
    var revealElements = document.querySelectorAll('.reveal');

    // Po dokončení animácie odstráni reveal triedy, aby neprepisovali
    // vlastné hover transition-y prvkov (napr. galéria).
    function finishReveal(el) {
        el.classList.remove('reveal');
        el.classList.remove('revealed');
        el.style.transitionDelay = '';
    }

    if (!('IntersectionObserver' in window)) {
        revealElements.forEach(finishReveal);
        return;
    }

    var revealedCount = 0;

    var observer = new IntersectionObserver(function(entries) {
        var delay = 0;
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                entry.target.style.transitionDelay = delay + 'ms';
                entry.target.classList.add('revealed');
                observer.unobserve(entry.target);
                setTimeout(finishReveal.bind(null, entry.target), 700 + delay);
                delay = Math.min(delay + 70, 350);
                revealedCount++;
            }
        });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    revealElements.forEach(function(el) { observer.observe(el); });

    // Poistka: ak sa do 4 s neodhalil ani jeden prvok (napr. tab na pozadí
    // so zastaveným vykresľovaním), zobraz všetko bez animácie.
    setTimeout(function() {
        if (revealedCount === 0) {
            observer.disconnect();
            document.querySelectorAll('.reveal').forEach(finishReveal);
        }
    }, 4000);
});

/* ---------- Info okná k masážam ---------- */

var massageInfo = {
    1: {
        title: 'Klasická masáž',
        intro: 'Klasická masáž je jedna z najrozšírenejších foriem terapie na <span class="swal-accent">uvoľnenie svalového napätia</span>, podporu krvného obehu a zlepšenie celkovej pohody.',
        sectionTitle: 'Hlavné techniky',
        items: [
            ['Hladenie', 'jemné pohyby na zahriatie pokožky'],
            ['Hnetenie', 'hlbšie pôsobenie na odstránenie napätia'],
            ['Rázne údery', 'rytmické poklepy na stimuláciu obehu'],
            ['Vibrovanie', 'jemné trasenie na relaxáciu'],
        ],
        noteLabel: 'Vhodné na:',
        note: 'Bolesti chrbta, stres, svalovú stuhnutosť, celkovú regeneráciu',
    },
    2: {
        title: 'Športová masáž',
        intro: 'Intenzívna technika zameraná na <span class="swal-accent">svalovú regeneráciu</span>, prevenciu zranení a zvýšenie fyzického výkonu.',
        sectionTitle: 'Hlavné techniky',
        items: [
            ['Hĺbková masáž', 'intenzívny tlak na hlbšie vrstvy'],
            ['Trenie', 'rázne pohyby na stimuláciu cirkulácie'],
            ['Stretching', 'natiahnutie svalov pre flexibilitu'],
            ['Percusné techniky', 'rýchle údery pred výkonom'],
        ],
        noteLabel: 'Vhodné pre:',
        note: 'Športovcov, aktívnych jedincov, prevenciu zranení, regeneráciu',
    },
    3: {
        title: 'Relaxačná masáž',
        intro: 'Jemná technika na <span class="swal-accent">odstránenie stresu</span>, uvoľnenie napätia a navodenie hlbokej pohody.',
        sectionTitle: 'Hlavné techniky',
        items: [
            ['Jemné hladenie', 'upokojujúce pohyby'],
            ['Pomalé hnetenie', 'bez hlbokého tlaku'],
            ['Aromaterapia', 's esenciálnymi olejmi'],
            ['Teplé obklady', 'zvýšený efekt uvoľnenia'],
        ],
        noteLabel: 'Ideálne pri:',
        note: 'Strese, nespavosti, únave, psychickom napätí',
    },
    4: {
        title: 'Mäkké techniky',
        intro: 'Šetrné terapeutické metódy na <span class="swal-accent">uvoľnenie napätia</span> a obnovenie rovnováhy pomocou jemného prístupu.',
        sectionTitle: 'Hlavné techniky',
        items: [
            ['Myofasciálna technika', 'uvoľnenie fascií'],
            ['Mobilizácie', 'uvoľnenie kĺbov'],
            ['Trigger point', 'odstránenie bolestivých bodov'],
            ['PIR technika', 'obnovenie pružnosti svalov'],
        ],
        noteLabel: 'Vhodné na:',
        note: 'Svalové bolesti, kĺbové problémy, chronické zápaly, relaxáciu',
    },
    5: {
        title: 'Lávové kamene',
        intro: 'Relaxačná technika využívajúca <span class="swal-accent">teplo vulkanických kameňov</span> na hlbokú relaxáciu a podporu krvného obehu.',
        sectionTitle: 'Spôsoby aplikácie',
        items: [
            ['Statická aplikácia', 'kamene na energetických bodoch'],
            ['Masáž kameňmi', 'jemné masírovanie pokožky'],
            ['Kombinovaná terapia', 's aromaterapiou'],
        ],
        noteLabel: 'Účinky:',
        note: 'Zmiernenie stresu, detoxikácia, energetická rovnováha',
    },
    6: {
        title: 'Bankovanie',
        intro: 'Tradičná metóda využívajúca <span class="swal-accent">vákuové poháre</span> na stimuláciu obehu, zmiernenie bolesti a detoxikáciu.',
        sectionTitle: 'Spôsoby aplikácie',
        items: [
            ['Suché bankovanie', 'priama aplikácia pohárov'],
            ['Mokré bankovanie', 's jemným narezaním'],
            ['Pohyblivé bankovanie', 'posúvanie pohárov'],
        ],
        noteLabel: 'Účinky:',
        note: 'Svalové bolesti, zápaly, migrény, posilnenie imunity',
    },
    7: {
        title: 'Moxovanie',
        intro: 'Starodávna čínska metóda využívajúca <span class="swal-accent">teplo z horiacej moxy</span> na stimuláciu akupunktúrnych bodov a posilnenie energie.',
        sectionTitle: 'Spôsoby aplikácie',
        items: [
            ['Priama moxa', 'kužele priamo na pokožke'],
            ['Nepriama moxa', 'cez medzičlánok (cesnak, soľ)'],
            ['Moxovacie cigary', 'držané nad pokožkou'],
        ],
        noteLabel: 'Vhodné pri:',
        note: 'Chronických ochoreniach, kĺbových bolestiach, oslabení imunity',
    },
    8: {
        title: 'FUSS Terapia',
        intro: 'Špeciálna metóda <span class="swal-accent">reflexnej masáže chodidiel</span>, ktorá stimuluje body prepojené s orgánmi a systémami tela.',
        sectionTitle: 'Hlavné benefity',
        items: [
            ['Zmiernenie stresu', 'úľava od napätia a únavy'],
            ['Podpora obehu', 'zlepšenie krvného obehu'],
            ['Posilnenie imunity', 'aktivácia obranných síl'],
            ['Energetická rovnováha', 'harmónia tela i mysle'],
        ],
        noteLabel: 'Odporúčané pre:',
        note: 'Prevenciu, celkovú regeneráciu, harmonizáciu organizmu',
    },
};

function buildMassageHtml(info) {
    var itemsHtml = info.items.map(function(item) {
        return '<div class="swal-check-item">' +
                   '<span class="swal-check">✓</span>' +
                   '<div><strong>' + item[0] + '</strong> – ' + item[1] + '</div>' +
               '</div>';
    }).join('');

    return '<div class="swal-massage-content">' +
               '<p class="swal-massage-intro">' + info.intro + '</p>' +
               '<div class="swal-technique-box">' +
                   '<h4>' + info.sectionTitle + '</h4>' +
                   '<div class="swal-check-list">' + itemsHtml + '</div>' +
               '</div>' +
               '<p class="swal-massage-note"><strong>' + info.noteLabel + '</strong> ' + info.note + '</p>' +
           '</div>';
}

function openSwal(id) {
    var info = massageInfo[id];
    if (!info) return;

    Swal.fire({
        title: info.title,
        width: '800px',
        html: buildMassageHtml(info),
        confirmButtonText: 'Zavrieť',
        confirmButtonColor: '#4CAF50',
        background: '#ffffff',
        customClass: {
            title: 'swal-title-custom',
            popup: 'swal-popup-custom'
        }
    });
}
