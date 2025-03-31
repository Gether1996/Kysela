function smoothScroll(targetId) {
    var target = document.getElementById(targetId);
    if (target) {
      var targetPosition = target.offsetTop - 170; // Get the target element's position with an additional 100px offset from the top
      var startPosition = window.pageYOffset; // Get current position
      var distance = targetPosition - startPosition;
      var duration = 1000; // Set the duration of the scroll in milliseconds
      let start = null;

      // Function to perform the scrolling animation
      function animation(currentTime) {
        if (start === null) {
          start = currentTime;
        }
        var timeElapsed = currentTime - start;
        var run = ease(timeElapsed, startPosition, distance, duration);
        window.scrollTo(0, run);
        if (timeElapsed < duration) {
          requestAnimationFrame(animation);
        }
      }

      // Easing function for smooth scrolling
      function ease(t, b, c, d) {
        t /= d / 2;
        if (t < 1) return c / 2 * t * t + b;
        t--;
        return -c / 2 * (t * (t - 2) - 1) + b;
      }

      requestAnimationFrame(animation);
    }
}

function scrollToTop() {
  const startPosition = window.pageYOffset;
  const distance = -startPosition;
  const duration = 1000;
  let start = null;

  function animation(currentTime) {
    if (start === null) {
      start = currentTime;
    }
    const timeElapsed = currentTime - start;
    const run = ease(timeElapsed, startPosition, distance, duration);
    window.scrollTo(0, run);
    if (timeElapsed < duration) {
      requestAnimationFrame(animation);
    }
  }

  // Easing function for smooth scrolling
  function ease(t, b, c, d) {
    t /= d / 2;
    if (t < 1) return c / 2 * t * t + b;
    t--;
    return -c / 2 * (t * (t - 2) - 1) + b;
  }

  requestAnimationFrame(animation);
}

var modal = document.getElementById("myModal");
var img = document.getElementById("img01");
var modalImg = document.getElementById("img01");

document.getElementsByClassName("close")[0].onclick = function() {
    modal.style.display = "none";
}

window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

function openBiggerImage(photoSrc) {
    modal.style.display = "block";
    modalImg.src = photoSrc;
}

function openSwal(id) {
    const massages = {
        1: {
            title: '<h2 style="color: #459b4a;">Klasická masáž</h2>',
            html: `
                <div style="text-align: justify; font-size: 16px; line-height: 1.5; color: #333; padding: 10px;">
                    <p>
                        Klasická masáž je jedna z najrozšírenejších foriem terapie, ktorá sa
                        využíva na <strong>uvoľnenie svalového napätia</strong>, podporu
                        krvného obehu a zlepšenie celkovej pohody. Táto technika kombinuje
                        rôzne masážne hmaty na stimuláciu svalov, šliach a nervového systému.
                    </p>
                    <p>
                        Existujú rôzne techniky klasickej masáže:
                        <ul style="margin-left: 20px;">
                            <li><strong>Hladenie:</strong> Jemné pohyby na zahriatie a uvoľnenie pokožky.</li>
                            <li><strong>Hnetenie:</strong> Hlbšie pôsobenie na svaly na odstránenie napätia.</li>
                            <li><strong>Rázne údery:</strong> Rytmické poklepy na stimuláciu krvného obehu.</li>
                            <li><strong>Vibrovanie:</strong> Jemné trasenie pre uvoľnenie a relaxáciu.</li>
                        </ul>
                    </p>
                    <p>
                        Klasická masáž je vhodná na liečbu bolestí chrbta, stresu, svalovej stuhnutosti
                        a celkovú regeneráciu organizmu.
                    </p>
                </div>
            `,
        },
        2: {
            title: '<h2 style="color: #459b4a;">Športová masáž</h2>',
            html: `
                <div style="text-align: justify; font-size: 16px; line-height: 1.5; color: #333; padding: 10px;">
                    <p>
                        Športová masáž je intenzívna technika zameraná na
                        <strong>zlepšenie svalovej regenerácie</strong>, prevenciu zranení a
                        zvýšenie fyzického výkonu. Táto masáž pomáha športovcom aj aktívnym
                        jednotlivcom uvoľniť svalové napätie, zlepšiť krvný obeh a
                        optimalizovať pohybový aparát.
                    </p>
                    <p>
                        Medzi hlavné techniky športovej masáže patria:
                        <ul style="margin-left: 20px;">
                            <li><strong>Hĺbková masáž:</strong> Intenzívne hnetenie a tlak na hlbšie vrstvy svalov.</li>
                            <li><strong>Trenie:</strong> Krátke a rázne pohyby na stimuláciu cirkulácie.</li>
                            <li><strong>Stretching:</strong> Kombinácia masáže a natiahnutia svalov pre flexibilitu.</li>
                            <li><strong>Percusné techniky:</strong> Rýchle údery na aktiváciu svalov pred výkonom.</li>
                        </ul>
                    </p>
                    <p>
                        Športová masáž je vhodná nielen pre profesionálnych športovcov, ale aj
                        pre všetkých, ktorí sa venujú fyzickej aktivite a chcú predchádzať
                        svalovým zraneniam, zlepšiť regeneráciu a zvýšiť celkovú pohyblivosť.
                    </p>
                </div>
            `,
        },
        3: {
            title: '<h2 style="color: #459b4a;">Relaxačná masáž</h2>',
            html: `
                <div style="text-align: justify; font-size: 16px; line-height: 1.5; color: #333; padding: 10px;">
                    <p>
                        Relaxačná masáž je jemná a upokojujúca technika, ktorej cieľom je
                        <strong>odstránenie stresu</strong>, uvoľnenie svalového napätia a
                        navodenie celkovej pohody. Pomáha zlepšiť krvný obeh, podporiť
                        regeneráciu organizmu a vyvolať pocit hlbokej relaxácie.
                    </p>
                    <p>
                        Medzi najčastejšie používané techniky relaxačnej masáže patria:
                        <ul style="margin-left: 20px;">
                            <li><strong>Jemné hladenie:</strong> Upokojujúce pohyby na uvoľnenie napätia.</li>
                            <li><strong>Pomalé hnetenie:</strong> Zmiernenie stuhnutosti svalov bez hlbokého tlaku.</li>
                            <li><strong>Aromaterapeutická masáž:</strong> Kombinácia relaxačných pohybov s esenciálnymi olejmi.</li>
                            <li><strong>Teplé obklady:</strong> Použitie tepla na zvýšenie efektu uvoľnenia.</li>
                        </ul>
                    </p>
                    <p>
                        Táto masáž je ideálna pre ľudí trpiacich stresom, nespavosťou,
                        únavou alebo psychickým napätím. Pomáha obnoviť vnútornú harmóniu a
                        prináša pocit celkového blaha.
                    </p>
                </div>
            `,
        },
        4: {
            title: '<h2 style="color: #459b4a;">Mäkké techniky</h2>',
            html: `
                <div style="text-align: justify; font-size: 16px; line-height: 1.5; color: #333; padding: 10px;">
                    <p>
                        Mäkké techniky sú šetrné terapeutické metódy, ktoré sa zameriavajú na
                        <strong>uvoľnenie svalového napätia</strong> a obnovenie rovnováhy v tele pomocou jemného a
                        neinvazívneho prístupu. Tieto techniky sú ideálne na zmiernenie bolesti,
                        zlepšenie flexibility a podporu prirodzenej regenerácie organizmu.
                    </p>
                    <p>
                        Medzi najbežnejšie mäkké techniky patrí:
                        <ul style="margin-left: 20px;">
                            <li><strong>Myofasciálna uvoľňovacia technika:</strong> Zameriava sa na uvoľnenie napätia v
                            svaloch a fasciách prostredníctvom jemného tlaku a pohybov.</li>
                            <li><strong>Mobilizácie:</strong> Pomocou pomalých, kontrolovaných pohybov sa uvoľňujú kĺby a
                            zlepšuje ich pohyblivosť.</li>
                            <li><strong>Trigger point terapia:</strong> Zameriava sa na odstraňovanie bolestivých
                            bodov vo svaloch a fasciach.</li>
                            <li><strong>Technika postizometrickej relaxácie (PIR):</strong> Kombinácia napínania a
                            uvoľňovania svalov s cieľom obnoviť ich pružnosť a elasticitu.</li>
                        </ul>
                    </p>
                    <p>
                        Mäkké techniky sa často používajú na liečbu svalových a kĺbových
                        bolestí, chronických zápalov, a na celkovú relaxáciu tela a mysle.
                    </p>
                </div>
            `,
        },
        5: {
            title: '<h2 style="color: #459b4a;">Lávové kamene</h2>',
            html: `
                <div style="text-align: justify; font-size: 16px; line-height: 1.5; color: #333; padding: 10px;">
                    <p>
                        Masáž lávovými kameňmi je relaxačná technika, ktorá využíva teplo
                        <strong>hladkých vulkanických kameňov</strong> na uvoľnenie svalového napätia
                        a podporu <em>hlbokého relaxu</em>. Táto terapia kombinuje tradičné masážne
                        techniky s teplom, ktoré preniká hlboko do svalov a stimuluje krvný obeh.
                    </p>
                    <p>
                        Existujú rôzne spôsoby aplikácie lávových kameňov:
                        <ul style="margin-left: 20px;">
                            <li><strong>Statická aplikácia:</strong> Kamene sa umiestňujú na konkrétne energetické body tela.</li>
                            <li><strong>Masáž kameňmi:</strong> Kameňmi sa jemne masíruje pokožka pre uvoľnenie svalstva.</li>
                            <li><strong>Kombinovaná terapia:</strong> Masáž sa kombinuje s aromaterapiou alebo reflexnou terapiou.</li>
                        </ul>
                    </p>
                    <p>
                        Táto masáž sa odporúča na zmiernenie stresu, zlepšenie cirkulácie krvi,
                        detoxikáciu organizmu a obnovenie energetickej rovnováhy.
                    </p>
                </div>
            `,
        },
        6: {
            title: '<h2 style="color: #459b4a;">Bankovanie - Terapia Vákuovými Pohármi</h2>',
            html: `
                <div style="text-align: justify; font-size: 16px; line-height: 1.5; color: #333; padding: 10px;">
                    <p>
                        Bankovanie je tradičná terapeutická metóda, ktorá využíva
                        <strong>vákuové poháre</strong> na stimuláciu krvného obehu,
                        zmiernenie bolesti a podporu detoxikácie organizmu. Táto technika sa
                        aplikuje priložením ohriatych alebo vákuových baniek na pokožku, čím sa
                        vytvorí podtlak, ktorý napomáha uvoľneniu svalov a zlepšeniu cirkulácie.
                    </p>
                    <p>
                        Existujú rôzne spôsoby aplikácie bankovania:
                        <ul style="margin-left: 20px;">
                            <li><strong>Suché bankovanie:</strong> Poháre sa aplikujú na pokožku bez ďalších zásahov.</li>
                            <li><strong>Mokré bankovanie:</strong> Po aplikácii sa vykonáva jemné narezanie kože na lepšiu detoxikáciu.</li>
                            <li><strong>Pohyblivé bankovanie:</strong> Poháre sa posúvajú po natretej pokožke pre intenzívnejší účinok.</li>
                        </ul>
                    </p>
                    <p>
                        Bankovanie je často využívané na liečbu svalových bolestí, zápalov,
                        migrén a na celkové posilnenie imunitného systému.
                    </p>
                </div>
            `,
        },
        7: {
            title: '<h2 style="color: #459b4a;">Moxovanie</h2>',
            html: `
                <div style="text-align: justify; font-size: 16px; line-height: 1.5; color: #333; padding: 10px;">
                    <p>
                        Moxovanie je starodávna čínska liečebná metóda, ktorá využíva teplo z
                        <strong>horiacej moxy</strong> (sušenej paliny) na stimuláciu
                        <strong>akupunktúrnych bodov</strong> tela. Táto technika sa používa
                        na podporu krvného obehu, zlepšenie vitality a posilnenie
                        životnej energie.
                    </p>
                    <p>
                        Existujú rôzne spôsoby aplikácie moxy:
                        <ul style="margin-left: 20px;">
                            <li><strong>Priama moxa:</strong> Malé kužele moxy sa umiestňujú priamo na kožu.</li>
                            <li><strong>Nepriama moxa:</strong> Používa sa medzičlánok ako plátok cesnaku či soľ.</li>
                            <li><strong>Moxovacie cigary:</strong> Držia sa nad pokožkou a vytvárajú hlboké teplo.</li>
                        </ul>
                    </p>
                    <p>
                        Moxovanie sa tradične využíva pri liečbe chronických ochorení, bolestí
                        kĺbov, oslabeného imunitného systému a zažívacích problémov.
                    </p>
                </div>
            `,
        },
        8: {
            title: '<h2 style="color: #459b4a;">FUSS Terapia</h2>',
            html: `
                <div style="text-align: left; font-size: 16px; line-height: 1.6; color: #333;">
                    <p><strong>FUSS terapia</strong> je špeciálna metóda, ktorá sa sústreďuje na <strong>reflexnú masáž chodidiel</strong>
                    s cieľom stimulovať určité body na ploskách nôh. Tieto body sú priamo prepojené s rôznymi orgánmi a systémami v tele,
                    čo umožňuje ovplyvňovať ich funkciu a podporovať <strong>prirodzenú rovnováhu organizmu</strong>.</p>
                    <p>Pravidelná aplikácia tejto terapie môže pomôcť zmierniť <strong>stres, napätie a únavu</strong>, podporiť
                    <strong>správne fungovanie krvného obehu</strong> a posilniť <strong>imunitný systém</strong>. Okrem toho napomáha
                    uvoľneniu svalstva, zlepšuje <strong>priechodnosť energetických dráh</strong> v tele a môže prispieť k celkovému pocitu pohody.</p>
                    <p>Vďaka týmto účinkom sa <strong>FUSS terapia</strong> odporúča nielen pri riešení konkrétnych zdravotných problémov,
                    ale aj ako účinný nástroj prevencie a podpory <strong>harmonického fungovania tela i mysle</strong>.</p>
                </div>
            `,
        }
    };

    if (massages[id]) {
        Swal.fire({
            title: massages[id].title,
            width: '60%',
            html: massages[id].html,
            confirmButtonText: 'Rozumiem',
            confirmButtonColor: '#28a745',
            background: "#f8f9fa",
            customClass: {
                popup: 'swal-massage-popup'
            }
        });
    }
}