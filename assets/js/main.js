function main() {
    // Defining HappyMeals' classes / var as an object
    let menu = new HappyMeals(recommendations, mealsPattern, weekUptake)
    const happyMeals = {
        'jours': menu.nameDays,
        'propoMenu': menu.provideMeals(),
        'propoWeek': menu.weekMap
    };

    // Propositions sur toute la semaine
    //console.log(menu.weekMap)

    // Totaux, jour par jour et sur toute la semaine
    //console.log(menu.totalsWeek)

    // Cartographie des non cumulables (proteines animales)
    //console.log(menu.cumulativeState)

    // Retrouver les arguments passés dans HappyMeals()
    //console.log(menu.reco)
    //console.log(menu.pattern)
    //console.log(menu.uptake)

    // les jours de la semaine
    //console.log(menu.nameDays)

    // Methode de débug complète :
    menu.debug();

    // Methode randomEntry : extrait une entrée au hasard d'un tableau ou d'un objet
    menu.randomEntry(menu.nameDays); // = jours aléatoire
    //console.log(happyMeals.propoWeek);

    // Creation / Adding of content & modals
    Object.entries(happyMeals.propoWeek).map((day, index) => {
        let divDay = document.querySelector(`.div${index+1}`);
        let divContent = `<div id="${day[0]}" class="dayName">${day[0]}</div>`;

        let modalDay = `<div class="modal-${day[0]}">\n<div class="close-modal-aliments"></div>\n<div class="modalAliments">`;
        Object.values(day[1]).map((el, index) => {
            switch (index) {
                case 0:
                    modalDay += '<h3>Petit-déjeuner</h3>';
                    break;
                case 1:
                    modalDay += '<h3>Déjeuner</h3>';
                    break;
                case 2:
                    modalDay += '<h3>Gouter</h3>';
                    break;
                case 3:
                    modalDay += '<h3>Dîner</h3>';
                    break;
            }

            modalDay += '<div class="alimentsList">';
            el.forEach(aliment => {
                modalDay += `<div class="categAli">${aliment.name}</div>`;
            });
            modalDay += '</div>';
        });

        modalDay += '</div>';
        modalDay += `<button>Éditer</button>`;
        modalDay += '</div>';

        divDay.innerHTML = divContent;
        document.querySelector(".right").innerHTML += modalDay;

    });

    /* ===== Click Listeners ===== */
    // Click listener on each days
    document.querySelectorAll('.parent > div').forEach((el) => {
        el.addEventListener('click', () => {
            document.querySelectorAll("div[class^='modal-']").forEach(item => {
                item.classList.remove('modalVisible')
            });
            document.querySelector(".modal-"+el.firstChild.id).classList.toggle('modalVisible')
            //el.innerHTML = 'toto';
        });
    });

    // Click listener to close modals
    document.querySelectorAll("div[class^='modal-'] .close-modal-aliments").forEach((el) => {
        el.addEventListener('click', () => {
            document.querySelectorAll("div[class^='modal-']").forEach(item => {
                item.classList.remove('modalVisible')
            });
        });
    });
}

document.addEventListener('DOMContentLoaded', main);