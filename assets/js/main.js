function main() {
    /*
        Le fonctionnement est le suivant: l'utilisateur démarre de base avec un menu généré aléatoirement. Il a
        ensuite le choix de soit modifier les aliments et leurs quantités, soit de suivre le menu donné.

        Dans la partie gauche, la liste des recommandations:
            - en vert, les catégories d'aliments constamment disponibles, dans limites de portions
            - en gris, les catégories d'aliments encore disponibles
            - en rouge, les catégories d'aliments dont les quantités sont atteintes / dépassées

        CE QU'IL RESTE À FAIRE
        Il reste à prendre en compte:
            - la notion de cumulative
            - le respect du pattern (3 portions au petit dej, 5 au dej,...) --> ok pour le bouton d'ajout
            - la possibilité de supprimer / d'ajouter un aliment par repas (mais ATTENTION à la notion de cumulative et du pattern)
            - remettre les valeurs initiales lorsqu'on clique sur le bouton "Annuler"
              --> (par exemple, si on met 3 portions d'oeufs au lieu de 1, on clique sur annuler, on doit retrouver 1)
     */

    // Defining HappyMeals' classes / variables as an object
    let menu;
    const userMenu = localStorage.getItem( 'userMenu' );
    if ( !userMenu || userMenu === null ) {
        console.log( 'Ehw, userMenu not found' )
        menu = new HappyMeals( recommendations, mealsPattern, weekUptake )
        // BUG: LE SETITEM ICI NE STORE PAS UN OBJET COMPLET... IL STORE WEEKUPTAKE, MAIS POURQUOI ????
        localStorage.setItem( 'userMenu', JSON.stringify( menu.weekMap ) )
    } else {
        console.log( 'Yay, userMenu founded in localStorage !' )
        menu = new HappyMeals( recommendations, mealsPattern, JSON.parse( userMenu ) )
    }

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
    console.log( menu.pattern )
    //console.log(menu.uptake)

    // les jours de la semaine
    //console.log(menu.nameDays)

    // Methode de débug complète :
    //menu.debug();

    // Methode randomEntry : extrait une entrée au hasard d'un tableau ou d'un objet
    //menu.randomEntry( menu.nameDays ); // = jours aléatoire
    //console.log(happyMeals.propoWeek);
    //console.log(menu.cumulativeState);



    /*
        Création d'un gros JSON, couplant les catégories d'aliments aux totaux des portions
        consommées à la semaine et leurs limites (min ou max)
    */
    let weekRecos = [];
    updateWeekRecos();
    function updateWeekRecos() {
        weekRecos = [];
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
                el.min ? recos.min = el.min : 0
                el.max ? recos.max = el.max : 0
            }
            recos.totalPortionsDay.push( menu.totalsWeek[el.id] );
            weekRecos.push( recos )
        } );

        /*Object.entries(menu.totalsWeek).map((el) => {
            weekRecos.forEach((reco) => {
                console.log(el[0]);
                if(reco.id === parseInt(el[0])) {
                    //console.log(el[1]);
                    reco.totalPortionsDay.push(el[1]);
                }

            })
        });*/

        weekRecos.forEach( ( reco ) => {
            if ( !reco.totalPortionsDay[0] || reco.totalPortionsDay[0].length === 0 ) {
                reco.totalPortionsDay[0] = { week: 0 };
            }
        } )
    }

    // Creation / Adding of content & modals
    Object.entries( happyMeals.propoWeek ).map( ( day, index ) => {
        let divDay = document.querySelector( `.div${index + 1}` );

        const week = [
            'monday',
            'tuesday',
            'wednesday',
            'thursday',
            'friday',
            'saturday',
            'sunday'
        ]

        const todayNumber = new Date().getDay()

        function isAPassedDay() {
            switch ( true ) {
                case week.indexOf( day[0] ) < todayNumber - 1:
                    return 'dayName white'
                case week.indexOf( day[0] ) === todayNumber - 1:
                    return 'dayName green-600'
                case week.indexOf( day[0] ) > todayNumber - 1:
                    return 'dayName gray-600'
            }
        }

        const
            divContent = document.createElement( 'div' ),
            textInDiv = document.createTextNode( week.indexOf( day[0] ) === todayNumber - 1 ? "Aujourd'hui" : day[0] )
        divContent.className = isAPassedDay()
        divContent.id = day[0]
        divContent.appendChild( textInDiv )

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
                    modalDay += '<h3>Goûter</h3>';
                    break;
                case 3:
                    modalDay += '<h3>Dîner</h3>';
                    break;
            }

            modalDay += '<div class="alimentsList flex wrap">';
            el.forEach( aliment => {
                modalDay += '<div class="categAli text-center">';
                modalDay += '<div class="delete-aliment none"></div>\n';
                modalDay += `<p class="alim-title">${aliment.name}</p>`;
                modalDay += `<input type="number" min="1" disabled value="${aliment.portions}" data-day="${day[0]}" data-aliment=${aliment.id} data-repas="${index}" class="alim-input-portion" />`;
                modalDay += '</div>';
            } );

            //détecter le nombre maximal d'aliments
            if ( el.length < menu.pattern[index].portions )
                modalDay += '<button class="add-item none" id="' + day[0] + '-' + index + '">+</button>'
            //console.log(menu.pattern[index])
            //console.log(el)
            //console.log(el.length)

            modalDay += '</div>';
        } );

        modalDay += '</div>';
        modalDay += `<p class="text-center"><button class="edit-day">Éditer</button></p>`;
        modalDay += `<p class="edit-alim-actions text-center flex justify-space-around none"><button class="edit-day-cancel">Annuler</button><button class="edit-day-confirm">Confirmer</button></p>`;
        modalDay += '</div>';

        divDay.appendChild( divContent );
        document.querySelector( ".right" ).innerHTML += modalDay;
    } );

    // Création des modals des recommandations de chaque jour
    /*let recoModalContainer = document.querySelector('.left .modal-recos');
    let eachDayModal = '';
    menu.nameDays.map(day => {
        eachDayModal += `<div class="reco-${day} reco-modal flex items-center wrap justify-space-around w-full h-1-2 p-48 h-full bg-gray-200">`
        Object.values(menu.totalsWeek).map(item => {
            //console.log(item)
        })
        eachDayModal += '</div>'
    })
    recoModalContainer.innerHTML = eachDayModal*/


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
            el.parentNode.querySelector( '.edit-day' ).classList.remove( 'none' )
            el.parentNode.querySelector( '.edit-alim-actions' ).classList.add( 'none' )
            el.parentNode.querySelectorAll( '.delete-aliment' ).forEach( item => {
                item.classList.add( 'none' )
            } )
            el.parentNode.querySelectorAll( "input" ).forEach( item => {
                item.setAttribute( 'disabled', true )
            } );
            hideEdit()
        } );
    } );

    // Click listener to edit aliments in modal day
    document.querySelectorAll( "button.edit-day" ).forEach( ( el ) => {
        el.addEventListener( 'click', () => {
            showEdit()
        } );
    } );

    // Click listener on cancel button in modal day (after having clicked on the edit button)
    document.querySelectorAll( "button.edit-day-cancel" ).forEach( ( el ) => {
        el.addEventListener( 'click', () => {
            el.parentNode.classList.add( 'none' )
            hideEdit()
        } );
    } );

    // Click listener on confirm button in modal day (after having clicked on the edit button)
    document.querySelectorAll( "button.edit-day-confirm" ).forEach( ( el ) => {
        el.addEventListener( 'click', () => {
            //Updating data.js
            /*
            * monday: {
                0: [
                  {id: 1, name: 'Fruits et légumes',  portions: 1},
                  {id: 9, name: 'Produits laitiers',  portions: 1},
                  {id: 5, name: 'Féculents et produits céréaliers',  portions: 1}
                ],
                1: [
                  {id: 9, name: 'Produits laitiers',  portions: 1},
                  {id: 1, name: 'Fruits et légumes',  portions: 1}
                ],
                2: [
                  {id: 9, name: 'Produits laitiers',  portions: 1},
                  {id: 1, name: 'Fruits et légumes',  portions: 1}
                ],
                3: [
                  {id: 9, name: 'Produits laitiers',  portions: 1},
                  {id: 1, name: 'Fruits et légumes',  portions: 1},
                  {id: 5, name: 'Féculents et produits céréaliers',  portions: 3}
                ]
              },
            *
            * */
            let menuStored = happyMeals.propoWeek
            let dayData = {
                0: [],
                1: [],
                2: [],
                3: []
            };
            el.parentElement.parentNode.querySelectorAll( "input" ).forEach( item => {
                const day = item.getAttribute( 'data-day' )
                const repas = item.getAttribute( 'data-repas' )
                const aliment = parseInt( item.getAttribute( 'data-aliment' ) )
                let alimentName = '';
                const portion = parseInt( item.value )

                //console.log(day, repas, aliment, portion)
                //console.log(weekUptake[day][repas])
                menu.reco.map( item => {
                    if ( item.id === aliment )
                        alimentName = item.name
                } )

                if ( alimentName !== '' )
                    dayData[repas].push( { id: aliment, name: alimentName, portions: portion } )

                menuStored[day] = dayData
            } );

            happyMeals.propoWeek = menuStored
            localStorage.setItem( 'userMenu', JSON.stringify( happyMeals.propoWeek ) )
            //console.log(happyMeals.propoWeek)

            menu = new HappyMeals( recommendations, mealsPattern, menuStored )
            updateWeekRecos();
            displayRecommandations();

            //Toggle class, attr,...
            hideEdit()
        } );
    } );

    // Click listener on 'delete aliment' button
    document.querySelectorAll( ".delete-aliment" ).forEach( ( el ) => {
        el.addEventListener( 'click', () => {
            const alimentToDelete = el.parentNode
            alimentToDelete.remove()
            //console.log(alimentToDelete)
        } );
    } );

    // Click listener on the "+" button to add an aliment to the menu
    // Click listener on the "+" button to display the modal to add an aliment to the menu
    document.querySelectorAll( ".add-item" ).forEach( ( el ) => {
        el.addEventListener( 'click', () => {
            console.log( 'add item !' )
            console.log( '/!\\ Verifiying the notion of cumulative' )
            console.log( 'Actuellement, si l\'aliment est déjà présent dans le repas et que le cumulative est === false, on ne l\'affiche pas dans la modal /!\\' )
            const modalAdd = document.querySelector( ".add-item-modal" )
            const modalAddItem = document.querySelector( ".add-item-modal .add-aliment-content" )
            const itemDatas = el.getAttribute( 'id' ).split( '-' );
            const itemDay = itemDatas[0];
            const itemMeal = parseFloat( itemDatas[1] );
            console.log( itemDatas, itemDay, itemMeal )

            let modalContent = `<div>Jour: ${itemDay} <br> Repas: ${itemMeal}</div>`;

            const propoAliments = happyMeals.propoWeek[itemDay][itemMeal]

            console.log( propoAliments )
            console.log( weekRecos )

            weekRecos.map( ( el ) => {
                //console.log(propoAliments.filter(aliment => (aliment.id === el.id) && !el.cumulative))
                if ( propoAliments.filter( aliment => ( aliment.id === el.id ) && !el.cumulative ).length !== 0 ) {
                } else {
                    if ( el.min !== 0 ) {
                        modalContent += '<div class="bg-green-400 w-auto-override h-auto-override">'
                        modalContent += `<a href="#" data-day="${itemDay}" data-meal="${itemMeal}" data-aliment="${el.id}" class="p-1 add-aliment-btn">${el.name}</a>\n</div>\n`;
                    } else if ( el.totalPortionsDay[0].week < el.max ) {
                        modalContent += '<div class="bg-gray-400 w-auto-override h-auto-override">'
                        modalContent += `<a href="#" data-day="${itemDay}" data-meal="${itemMeal}" data-aliment="${el.id}" class="p-1 add-aliment-btn">${el.name}</a>\n</div>\n`;
                    } else if ( el.totalPortionsDay[0].week >= el.max ) {
                        modalContent += ''
                    }
                }
            } )

            //if(cumulative === false) {
            //} else {

            //let divContent = `<div id="${day[0]}" class="dayName">${day[0]}</div>`;
            modalAddItem.innerHTML = modalContent;
            modalAdd.classList.remove( 'none' );

            document.querySelectorAll( ".add-aliment-btn" ).forEach( ( el ) => {
                el.addEventListener( 'click', () => {
                    const alimID = el.getAttribute( 'data-aliment' )
                    const alimDay = el.getAttribute( 'data-day' )
                    const alimMeal = el.getAttribute( 'data-meal' )
                    console.log( 'Add the aliment: ' + alimID )
                    console.log( alimDay )
                    console.log( alimMeal )
                    console.log( propoAliments )

                    const menuStored = happyMeals.propoWeek
                    const menuStoredAliment = happyMeals.propoWeek[alimDay][alimMeal]
                    console.log( happyMeals.propoWeek[alimDay][alimMeal] )
                } )
            } )
        } )
    } );

    // Click listener to close modal to add an aliment to the menu
    document.querySelector( '.close-add-item-modal' ).addEventListener( 'click', ( el ) => {
        document.querySelector( '.close-add-item-modal' ).parentElement.classList.add( 'none' )
    } )

    displayRecommandations();
    function displayRecommandations() {
        console.log( 'Affichage / MAJ des recommandations' )
        // Ajout des recommandations dans la partie gauche
        let recoContent = document.querySelector( '.left .parent-reco' );
        let categAliments = '';
        weekRecos.map( ( el, index ) => {
            //console.log(el)
            if ( el.min !== 0 ) {
                categAliments += '<div class="bg-green-400 w-auto-override h-auto-override">'
            }
            else if ( el.totalPortionsDay[0].week < el.max ) {
                categAliments += '<div class="bg-gray-400 w-auto-override h-auto-override">'
            }
            else if ( el.totalPortionsDay[0].week >= el.max ) {
                categAliments += '<div class="bg-red-400 w-auto-override h-auto-override">'
            }
            categAliments += `<p class="p-1">${el.name}</p>\n</div>\n</div>`;
        } )
        recoContent.innerHTML = categAliments
    }

    // Function to hide edit buttons, add item,...
    function hideEdit() {
        document.querySelectorAll( ".alimentsList" ).forEach( ( item ) => {
            item.parentNode.parentNode.querySelector( '.edit-day' ).classList.remove( 'none' )
            item.parentNode.parentNode.parentNode.querySelector( '.edit-alim-actions' ).classList.add( 'none' )
            item.querySelectorAll( '.delete-aliment' ).forEach( item => {
                item.classList.add( 'none' )
            } )
            item.querySelectorAll( "input" ).forEach( item => {
                item.setAttribute( 'disabled', true );
            } );
            item.querySelectorAll( ".add-item" ).forEach( item => {
                item.classList.add( 'none' )
            } )
            // Just to be sure it's hidden
            const modalAddItem = document.querySelector( ".add-item-modal" )
            modalAddItem.classList.add( 'none' )
        } )
    }

    // Function to hide edit buttons, add item,...
    function showEdit() {
        document.querySelectorAll( ".alimentsList" ).forEach( ( item ) => {
            item.parentNode.parentNode.querySelector( '.edit-day' ).classList.add( 'none' )
            item.parentNode.parentNode.parentNode.querySelector( '.edit-alim-actions' ).classList.remove( 'none' )
            item.querySelectorAll( '.delete-aliment' ).forEach( item => {
                item.classList.remove( 'none' )
            } )
            item.querySelectorAll( "input" ).forEach( item => {
                item.removeAttribute( 'disabled' );
            } );
            item.querySelectorAll( ".add-item" ).forEach( item => {
                item.classList.remove( 'none' )
            } )
        } )
    }
}

document.addEventListener( 'DOMContentLoaded', main )
