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
        console.log( 'Yay, userMenu found in localStorage !' )
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
    //console.log( menu.pattern )
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

        weekRecos.forEach( ( reco ) => {
            if ( !reco.totalPortionsDay[0] || reco.totalPortionsDay[0].length === 0 ) {
                reco.totalPortionsDay[0] = { week: 0 };
            }
        } )
    }

    // Creation / Adding of content & modals
    function createModalDays() {
        document.querySelectorAll( 'div[class^="modal-"]' ).forEach( modal => modal.remove() )
        document.querySelector( '.parent' ).textContent = ''
        Object.entries( happyMeals.propoWeek ).map( ( day, index ) => {
            const
                todayNumber = new Date().getDay(),
                defaultDayClasses = 'dayName radius-md flex items-center justify-center transform-capitalize cursor-pointer'

            function isAPassedDay() {
                switch ( true ) {
                    case happyMeals.jours.indexOf( day[0] ) < todayNumber - 1:
                        return `${defaultDayClasses} gray-500 bg-gray-300`
                    case happyMeals.jours.indexOf( day[0] ) === todayNumber - 1:
                        return `${defaultDayClasses} white bg-green-600`
                    case happyMeals.jours.indexOf( day[0] ) > todayNumber - 1:
                        return `${defaultDayClasses} white bg-gray-600`
                }
            }

            const
                divContent = document.createElement( 'div' ),
                textInDiv = document.createTextNode( happyMeals.jours.indexOf( day[0] ) === todayNumber - 1 ? "Aujourd'hui" : day[0] )
            divContent.className = isAPassedDay()
            divContent.id = day[0]
            divContent.appendChild( textInDiv )

            let modalDay = `<div class="modal-${day[0]} p-48 flex column justify-space-evenly" data-day='${day[0]}'>\n<div class="close-modal-aliments">Retour</div>\n<div class="modalAliments">`;
            Object.values( day[1] ).map( ( el, index ) => {
                modalDay += '<details open>'
                const defaultMealSummaryClasses = 'text-center font-xl bg-gray-200 flex items-center justify-space-between row-reverse p-2'
                switch ( index ) {
                    case 0:
                        modalDay += `<summary class="${defaultMealSummaryClasses}">Petit-déjeuner</summary>`
                        break;
                    case 1:
                        modalDay += `<summary class="${defaultMealSummaryClasses}">Déjeuner</summary>`
                        break;
                    case 2:
                        modalDay += `<summary class="${defaultMealSummaryClasses}">Goûter</summary>`
                        break;
                    case 3:
                        modalDay += `<summary class="${defaultMealSummaryClasses}">Dîner</summary>`
                        break;
                }

                modalDay += '<div class="alimentsList flex wrap column">';
                el.forEach( aliment => {
                    modalDay += '<div class="categAli text-center flex w-full">';
                    modalDay += '<div class="delete-aliment none"></div>\n';
                    modalDay += `<p class="alim-title font-md">${aliment.name}</p>`;
                    modalDay += `<input type="number" min="1" disabled value="${aliment.portions}" data-day="${day[0]}" data-aliment=${aliment.id} data-repas="${index}" class="alim-input-portion" />`;
                    modalDay += '</div>';
                } );

                //détecter le nombre maximal d'aliments
                if ( el.length < menu.pattern[index].portions )
                    modalDay += '<button class="add-item none" id="' + day[0] + '-' + index + '">+</button>';

                modalDay += '</div></details>';
            } );

            modalDay += '</div>';
            modalDay += `<p class="text-center"><button class="edit-day">Éditer mon menu</button></p>`;
            modalDay += `<p class="edit-alim-actions text-center flex justify-space-around none"><button class="edit-day-cancel">Annuler</button><button class="edit-day-confirm">Confirmer</button></p>`;
            modalDay += '</div>';

            document.querySelector( '.parent' ).appendChild( divContent );
            document.querySelector( ".right" ).innerHTML += modalDay;
        } )
    }
    createModalDays();

    /* ===== Click Listeners ===== */
    // Click listener on each days
    function handleClick() {
        document.querySelectorAll( '.parent > .dayName' ).forEach( ( el ) => {
            el.addEventListener( 'click', () => {
                document.querySelectorAll( "div[class^='modal-']" ).forEach( item => {
                    item.classList.remove( 'modalVisible' )
                } );
                document.querySelector( ".modal-" + el.id ).classList.toggle( 'modalVisible' )
                //el.innerHTML = 'toto';
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

                    // createModalDays()
                    // handleClick()
                    hideEdit( el.parentElement.getAttribute( 'data-day' ) )
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
                    el.parentElement.classList.add( 'none' )
                    hideEdit( el.parentElement.parentElement.getAttribute( 'data-day' ) )
                    // Actually, clicking on the 'Annuler' button remove the modal: this allow us to retrieve datas before editing
                    // (for example, if we edit, delete some aliments and cancel = before this, we don't retrieve datas)
                    // createModalDays()
                    // handleClick()
                } );
            } );

            // Click listener on confirm button in modal day (after having clicked on the edit button)
            document.querySelectorAll( "button.edit-day-confirm" ).forEach( ( el ) => {
                el.addEventListener( 'click', () => {
                    //Updating data.js
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

                    menu = new HappyMeals( recommendations, mealsPattern, menuStored )
                    updateWeekRecos();
                    displayRecommandations();

                    //Toggle class, attr,...
                    hideEdit( el.parentElement.parentElement.getAttribute( 'data-day' ) )

                    // console.log( 'recreate all' )
                    // createModalDays()
                    // handleClick()
                } );
            } );

            // Click listener on 'delete aliment' button
            document.querySelectorAll( ".delete-aliment" ).forEach( ( el ) => {
                el.addEventListener( 'click', () => {
                    const alimentToDelete = el.parentNode
                    alimentToDelete.remove()
                } );
            } );

            // Click listener on the "+" button to display the modal to add an aliment to the menu
            document.querySelectorAll( ".add-item" ).forEach( ( el ) => {
                el.addEventListener( 'click', () => {
                    console.log( '/!\\ Verifiying the notion of cumulative' )
                    console.log( 'Actuellement, si l\'aliment est déjà présent dans le repas et que le cumulative est === false, on ne l\'affiche pas dans la modal /!\\' )
                    const modalAdd = document.querySelector( ".add-item-modal" )
                    const modalAddItem = document.querySelector( ".add-item-modal .add-aliment-content" )
                    const itemDatas = el.getAttribute( 'id' ).split( '-' );
                    const itemDay = itemDatas[0];
                    const itemMeal = parseFloat( itemDatas[1] );

                    let modalContent = `<div>Jour: ${itemDay} <br> Repas: ${itemMeal}</div>`;

                    const propoAliments = happyMeals.propoWeek[itemDay][itemMeal]

                    // Let's create the clickable aliments
                    weekRecos.map( ( el ) => {
                        if ( propoAliments.filter( aliment => ( aliment.id === el.id ) && !el.cumulative ).length !== 0 ) {
                            //console.log('cumulative to false')
                        } else if ( propoAliments.filter( aliment => ( aliment.id === el.id ) ).length !== 0 ) {
                            //console.log('aliment already exists: ', el.name)
                        } else {
                            if ( el.min !== 0 ) {
                                modalContent += '<div class="bg-green-400 w-auto-override h-auto-override">'
                                modalContent += `<a href="#" data-day="${itemDay}" data-meal="${itemMeal}" data-aliment="${el.id}" class="p-1 add-aliment-btn">${el.name}</a>\n</div>\n`;
                            } else if ( el.totalPortionsDay[0].week < el.max ) {
                                modalContent += '<div class="bg-green-400 w-auto-override h-auto-override">'
                                modalContent += `<a href="#" data-day="${itemDay}" data-meal="${itemMeal}" data-aliment="${el.id}" class="p-1 add-aliment-btn">${el.name}</a>\n</div>\n`;
                            } else if ( el.totalPortionsDay[0].week >= el.max ) {
                                modalContent += ''
                            }
                        }
                    } );
                    modalAddItem.innerHTML = modalContent;
                    modalAdd.classList.remove( 'none' );

                    // Handle a click on this aliments and adding it - or not - to the menu
                    document.querySelectorAll( ".add-aliment-btn" ).forEach( ( itemAdd ) => {
                        itemAdd.addEventListener( 'click', () => {
                            const alimID = itemAdd.getAttribute( 'data-aliment' )
                            const alimDay = itemAdd.getAttribute( 'data-day' )
                            const alimMeal = itemAdd.getAttribute( 'data-meal' )
                            const menuStored = happyMeals.propoWeek
                            const menuStoredAliment = menuStored[alimDay][alimMeal]

                            // Condition to handle multiple clicks on the same aliment
                            if ( menuStoredAliment.filter( alim => alim.id === alimID ).length > 0 )
                                return false

                            // Let's add the aliment in the modal
                            let alimName = '';
                            weekRecos.map( item => {
                                if ( item.id === parseInt( alimID ) )
                                    alimName = item.name
                            } )
                            let newAlimDiv = document.createElement( 'div' );
                            newAlimDiv.classList = 'categAli text-center m-1';
                            let newAlimDivContent = '<div class="delete-aliment"></div>\n';
                            newAlimDivContent += `<p class="alim-title">${alimName}</p>`;
                            newAlimDivContent += `<input type="number" min="1" value="1" data-day="${alimDay}" data-aliment=${alimID} data-repas="${alimMeal}" class="alim-input-portion" />`;
                            newAlimDivContent += '</div>';
                            newAlimDiv.innerHTML = newAlimDivContent;
                            el.parentElement.insertBefore( newAlimDiv, el )

                            // Let's store data locally
                            menuStoredAliment.push( {
                                id: alimID,
                                name: alimName,
                                portions: 1
                            } )
                            happyMeals.propoWeek = menuStored
                            localStorage.setItem( 'userMenu', JSON.stringify( happyMeals.propoWeek ) )
                            menu = new HappyMeals( recommendations, mealsPattern, menuStored )
                            updateWeekRecos();
                            displayRecommandations();

                            handleClick()
                        } )
                    } )
                } )
            } );

            // Click listener to close modal to add an aliment to the menu
            document.querySelector( '.close-add-item-modal' ).addEventListener( 'click', ( el ) => {
                document.querySelector( '.close-add-item-modal' ).parentElement.classList.add( 'none' )
            } )
        } )
    }
    handleClick()

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
            categAliments += `<p class="p-1 font-md ptb-2 prl-3">${el.name}</p>\n</div>\n</div>`;
        } )
        recoContent.innerHTML = categAliments
    }

    // Function to hide edit buttons, add item,...
    function hideEdit( currentOpenDay ) {
        document.querySelectorAll( ".alimentsList" ).forEach( ( item ) => {
            item.parentNode.parentNode.parentNode.querySelector( '.edit-day' ).classList.remove( 'none' )
            item.parentNode.parentNode.parentNode.querySelector( '.edit-alim-actions' ).classList.add( 'none' )

            const arrayValues = ['.delete-aliment', '.add-item', 'input']
            arrayValues.map( el => {
                item.querySelectorAll( el ).forEach( item => {
                    el === 'input'
                        ? item.setAttribute( 'disabled', true )
                        : item.classList.add( 'none' )
                } )
            } )

            // Just to be sure it's hidden
            const modalAddItem = document.querySelector( ".add-item-modal" )
            modalAddItem.classList.add( 'none' )
        } )
        Object.values( menu.weekMap[currentOpenDay] ).map( el => {
            el.forEach( aliment => {
                document.querySelectorAll( `.modal-${currentOpenDay} input[data-aliment="${aliment.id}"]` ).forEach( el => el.value = aliment.portions )
            } )
        } )
    }

    // Function to hide edit buttons, add item,...
    function showEdit() {
        document.querySelectorAll( ".alimentsList" ).forEach( ( item ) => {
            item.parentNode.parentNode.parentNode.querySelector( '.edit-day' ).classList.add( 'none' )
            item.parentNode.parentNode.parentNode.querySelector( '.edit-alim-actions' ).classList.remove( 'none' )

            const arrayValues = ['.delete-aliment', '.add-item', 'input']
            arrayValues.map( el => {
                item.querySelectorAll( el ).forEach( item => {
                    el === 'input'
                        ? item.removeAttribute( 'disabled' )
                        : item.classList.remove( 'none' )
                } )
            } )
        } )
    }
}

document.addEventListener( 'DOMContentLoaded', main )
