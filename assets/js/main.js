function main() {
    // Defining HappyMeals' classes / var as an object
    console.log(localStorage)
    const userMenu = localStorage.getItem('userMenu');
    let menu;
    if(!userMenu || userMenu === null) {
        console.log('userMenu not found')
        menu = new HappyMeals(recommendations, mealsPattern, weekUptake)
    } else {
        console.log(JSON.parse(userMenu))
        menu = new HappyMeals(recommendations, mealsPattern, JSON.parse(userMenu))
    }

    console.log(menu)

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
    //menu.debug();

    // Methode randomEntry : extrait une entrée au hasard d'un tableau ou d'un objet
    //menu.randomEntry( menu.nameDays ); // = jours aléatoire
    //console.log(happyMeals.propoWeek);
    //console.log(menu.cumulativeState);

    // Creation / Adding of content & modals
    Object.entries( happyMeals.propoWeek ).map( ( day, index ) => {
        let divDay = document.querySelector( `.div${index + 1}` );
        let divContent = `<div id="${day[0]}" class="dayName">${day[0]}</div>`;

        let modalDay = `<div class="modal-${day[0]}">\n<div class="close-modal-aliments"></div>\n<div class="modalAliments">`;
        Object.values( day[1] ).map( ( el, index ) => {
            switch ( index ) {
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

            modalDay += '<div class="alimentsList flex">';
            el.forEach( aliment => {
                modalDay += `<div class="categAli text-center m-1"><p class="alim-title">${aliment.name}</p>`;
                modalDay += `<input type="number" disabled value="${aliment.portions}" data-day="${day[0]}" data-aliment=${aliment.id} data-repas="${index}" class="alim-input-portion" />`;
                modalDay += '</div>';
            } );
            modalDay += '</div>';
        } );

        modalDay += '</div>';
        modalDay += `<p class="text-center"><button class="edit-day">Éditer</button></p>`;
        modalDay += `<p class="edit-alim-actions text-center flex justify-space-around none"><button class="edit-day-cancel">Annuler</button><button class="edit-day-confirm">Confirmer</button></p>`;
        modalDay += '</div>';

        divDay.innerHTML = divContent;
        document.querySelector( ".right" ).innerHTML += modalDay;
    } );

    /* ===== Click Listeners ===== */
    // Click listener on each days
    document.querySelectorAll( '.parent > div' ).forEach( ( el ) => {
        el.addEventListener( 'click', () => {
            document.querySelectorAll( "div[class^='modal-']" ).forEach( item => {
                item.classList.remove( 'modalVisible' )
            } );
            document.querySelector( ".modal-" + el.firstChild.id ).classList.toggle( 'modalVisible' )
            //el.innerHTML = 'toto';
        } );
    } );

    // Click listener to close modals
    document.querySelectorAll( "div[class^='modal-'] .close-modal-aliments" ).forEach( ( el ) => {
        el.addEventListener( 'click', () => {
            document.querySelectorAll( "div[class^='modal-']" ).forEach( item => {
                item.classList.remove( 'modalVisible' )
            } );
            el.parentNode.querySelectorAll( "input" ).forEach( item => {
                item.setAttribute('disabled', true)
            } );
        } );
    } );

    // Click listener to edit aliments in modal day
    document.querySelectorAll( "button.edit-day" ).forEach( ( el ) => {
        el.addEventListener( 'click', () => {
            el.classList.add('none')
            el.parentElement.parentNode.querySelector('.edit-alim-actions').classList.remove('none')
            el.parentElement.parentNode.querySelectorAll( "input" ).forEach( item => {
                item.removeAttribute('disabled');
            } );
        } );
    } );

    // Click listener on cancel button in modal day (after having clicked on the edit button)
    document.querySelectorAll( "button.edit-day-cancel" ).forEach( ( el ) => {
        el.addEventListener( 'click', () => {
            el.parentNode.classList.add('none')
            el.parentElement.parentNode.querySelector('.edit-day').classList.remove('none')
            el.parentElement.parentNode.querySelectorAll( "input" ).forEach( item => {
                item.setAttribute('disabled', true);
            } );
        } );
    } );

    // Click listener on confirm button in modal day (after having clicked on the edit button)
    document.querySelectorAll( "button.edit-day-confirm" ).forEach( ( el ) => {
        el.addEventListener( 'click', () => {
            //Updating data.js
            let menuStored = happyMeals.propoWeek
            el.parentElement.parentNode.querySelectorAll( "input" ).forEach( item => {
                const day = item.getAttribute('data-day')
                const repas = item.getAttribute('data-repas')
                const aliment = parseInt(item.getAttribute('data-aliment'))
                const portion = parseInt(item.value)
                //console.log(day, repas, aliment, portion)
                //console.log(weekUptake[day][repas])
                menuStored[day][repas].map(el => {
                    if(el.id === aliment && el.portions !== portion)
                        el.portions = portion
                })
            } );
            happyMeals.propoWeek = menuStored
            localStorage.setItem('userMenu', JSON.stringify(happyMeals.propoWeek))
            console.log(happyMeals.propoWeek)

            //Toggle class, attr,...
            el.parentNode.classList.add('none')
            el.parentElement.parentNode.querySelector('.edit-day').classList.remove('none')
            el.parentElement.parentNode.querySelectorAll( "input" ).forEach( item => {
                item.setAttribute('disabled', true);
            } );
        } );
    } );


    // Création d'un gros JSON, couplant les fruits et légumes au totaux des portions
    // consommées à la semaine et leurs limites (min ou max)
    const weekRecos = [];
    menu.reco.forEach( el => {
        const recos = {
            id: el.id,
            name: el.name,
            totalPortionsDay: [],
            min: 0,
            max: 0,
            current: 0,
            cumulative: el.cumulative
        };
        if ( el.period === 'day' ) {
            el.min ? recos.min = el.min * 7 : 0
            el.max ? recos.max = el.max * 7 : 0
        } else {
            el.min ? recos.min = el.min  : 0
            el.max ? recos.max = el.max : 0
        }
        recos.totalPortionsDay.push(menu.totalsWeek[el.id]);
        weekRecos.push( recos )
    });

    /*Object.entries(menu.totalsWeek).map((el) => {
        weekRecos.forEach((reco) => {
            console.log(el[0]);
            if(reco.id === parseInt(el[0])) {
                //console.log(el[1]);
                reco.totalPortionsDay.push(el[1]);
            }

        })
    });*/

    weekRecos.forEach((reco) => {
        if(!reco.totalPortionsDay[0] || reco.totalPortionsDay[0].length === 0) {
            reco.totalPortionsDay[0] = {week: 0};
        }
    })

    //console.log(menu.reco, weekRecos);


    // Ajout des recommandations dans la partie gauche
    let recoContent = document.querySelector('.left .parent-reco');
    let categAliments = '';
    weekRecos.map((el, index) => {
        /*Object.entries(el.totalPortionsDay[0]).map(day => {
            categAliments += `<div class="reco-${day[0]} flex items-center wrap justify-space-around w-full h-1-2 p-48 h-full bg-gray-200"></div>`
        })*/
        //console.log(el.name, el.min, el.max, el.totalPortionsDay[0].week);

        if(el.min !== 0) {
            categAliments += '<div class="bg-green-400 w-auto-override m-1 h-auto-override">'
        }
        else if(el.totalPortionsDay[0].week < el.max) {
            categAliments += '<div class="bg-gray-400 w-auto-override m-1 h-auto-override">'
        }
        else if(el.totalPortionsDay[0].week >= el.max) {
            categAliments += '<div class="bg-red-400 w-auto-override m-1 h-auto-override">'
        }
        categAliments += `<p class="p-1">${el.name}</p>\n</div>\n</div>`;
    })
    recoContent.innerHTML = categAliments


    // Création des modals des recommandations de chaque jour
    let recoModalContainer = document.querySelector('.left .modal-recos');
    let eachDayModal = '';
    menu.nameDays.map(day => {
        eachDayModal += `<div class="reco-${day} reco-modal flex items-center wrap justify-space-around w-full h-1-2 p-48 h-full bg-gray-200">`
        Object.values(menu.totalsWeek).map(item => {
            //console.log(item)
        })
        eachDayModal += '</div>'
    })
    recoModalContainer.innerHTML = eachDayModal
}

document.addEventListener( 'DOMContentLoaded', main )
