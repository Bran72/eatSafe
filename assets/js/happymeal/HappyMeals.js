class HappyMeals {

  /* Constructor : Déclaration et création de quelques variables utiles */

  constructor(reco, pattern, uptake = []) {
    this.days = 7
    this.nameDays = ['monday','tuesday','wednesday', 'thursday', 'friday', 'saturday', 'sunday' ]
    this.reco = reco
    this.pattern = pattern
    this.uptake = uptake
    this.totalsWeek = {}
    this.cumulativeState = {}
    this.weekMap = this.weekMap()
  }

  /* provideMeals : Methode principale retournant toutes les proposition de menus de la semaine */

  provideMeals() {
    // on commence par boucler sur chaque jour de weekMap
    for(let nameDay in this.weekMap){
      // puis on boucle sur chaque menu
      for (var i = 0; i < this.pattern.length; i++) {
        // on verifie que le menu n'existe pas déjà
        if(this.weekMap[nameDay][i] === undefined){
          // Si le menu n'existe pas alors on le crée
          this.createMeal(nameDay, this.pattern[i], i)
        }else{
          // TODO : si le menu existe et qu'il est incomplet, on le complète
        }
      }
    }
  }


  /* createMeal : créer un menu en vérifiant les reco */

  createMeal(nameDay, mealPattern, mealIndex){
    // on va chercher un aliment au hasard jusqu'à ce que le nombre de portion par menu soit atteint
    let portions = mealPattern.portions
    let i = 0;
    let newMeal = []
    //console.log('newMeal', newMeal)
    while (i < portions) {
      let newAliment = this.randomEntry(this.reco)
      // on vérifie si on peut ajouter cet aliment

      if(this.checkMax(newAliment, nameDay, newMeal) && this.checkCumul(newAliment, nameDay, newMeal) ){
        // on vérifie qu'on a pas déjà ajouté l'aliment, autrement on cumule la quantité
        let sameAlimKey = newMeal.findIndex(alim => alim.id == newAliment.id)
        if(sameAlimKey >= 0){
          newMeal[sameAlimKey].portions = newMeal[sameAlimKey].portions + 1
        }else{
          newMeal.push({
            id: newAliment.id,
            name: newAliment.name,
            portions: 1,
            cumulative: newAliment.cumulative
          })
        }
        i++
      }
    }
    //  On ajoute le menu crée au jour de la semaine
    this.weekMap[nameDay][mealIndex] = newMeal
    // On incrémente les totaux
    this.incrementTotals(nameDay, newMeal)
  }

  /* checkCumulative : Verifie si on peut cumuler ce produit avec d'autres utiliser dans la même journée */

  checkCumul(newAliment, nameDay, newMeal){
    // si l'aliment est cumulable, on le vérifie pas
    if(newAliment.cumulative){
      return true
    }else{
      // on controle si un autre aliment non cumulable est déjà présent dans cette journée
      if(this.cumulativeState[nameDay]){
        return false
      }else{
        // on vérifie s'il n'y a pas déjà un non cumulable dans le menu en cours de création
        let allreadyNotCumulative = newMeal.find(alim => alim.cumulative == newAliment.cumulative)
        if(allreadyNotCumulative !== undefined){
          return false
        }else{
          return true
        }
      }
    }
  }

  /* checkMax : Vérifie si le max d'un aliment a déjà été atteint */

  checkMax(newAliment, nameDay, currentMeal){
    let max = this.reco.find(alim => alim.id == newAliment.id).max
    // si l'aliment n'a pas de propriété max, alors il est ilimité
    if(max === undefined){
      return true
    }
    // On vérifie si l'ingrédient ne se trouve pas déjà dans le menu en cours de composition
    if(currentMeal.find(alim => alim.id == newAliment.id) !== undefined){
      max = max - currentMeal.find(alim => alim.id == newAliment.id).portions
      // S'il est déjà dans le panier et que le max est atteint, on ne va pas plus loin
      if(!max){
        return false
      }
    }
    // on va chercher la quantité actuel déjà proposée selon la périodicité
    let period = this.reco.find(alim => alim.id == newAliment.id).period
    let currentQty = undefined
    if((period == 'day') && (this.totalsWeek[newAliment.id] !== undefined) && (this.totalsWeek[newAliment.id][nameDay] !== undefined)){
      currentQty = this.totalsWeek[newAliment.id][nameDay]
    }
    if((period == 'week') && (this.totalsWeek[newAliment.id] !== undefined) && (this.totalsWeek[newAliment.id]['week'] !== undefined)){
      currentQty = this.totalsWeek[newAliment.id]['week']
    }
    if( currentQty === undefined ){
      currentQty = 0
    }
    // si le max n'est pas encore atteint, on valide
    if(currentQty < max){
      return true
    }else{
      return false
    }
    // TODO : Check si l'aliment est déjà dans le menu en cours et si son max l'y autorise
    // la comparaison se fait actuellement sur totalsWeek, incrémenté menu par menu et non aliment par aliment
  }

  /* IncrementsTotals : Incrémente le total des aliments par jour et par semaine au fur et à mesure de l'ajout / création de menu */

  incrementTotals(nameDay, meal){
    // pour chaque menu...
    for (let i = 0; i < meal.length; i++) {
      // on crée la structure de l'object totalsWeek de manière dynamique
      if(this.totalsWeek[meal[i].id] === undefined){
        this.totalsWeek[meal[i].id] = {}
      }
      if(this.totalsWeek[meal[i].id][nameDay] === undefined){
        this.totalsWeek[meal[i].id][nameDay] = 0
      }
      this.totalsWeek[meal[i].id][nameDay] = this.totalsWeek[meal[i].id][nameDay] + meal[i].portions
      // on crée une entrée spécifique pour le total de la semaine
      if(this.totalsWeek[meal[i].id]['week'] === undefined){
        this.totalsWeek[meal[i].id]['week'] = 0
      }
      this.totalsWeek[meal[i].id]['week'] = this.totalsWeek[meal[i].id]['week'] + meal[i].portions
      // on enregistre les ingrédients non cumulables dans cumulativeState
      if((this.cumulativeState[nameDay] === undefined) && !this.reco.find(alim => alim.id == meal[i].id).cumulative){
        // console.warn(meal[i].name, this.reco.find(alim => alim.id == meal[i].id).cumulative)
        this.cumulativeState[nameDay] = meal[i].name
      }
    }

  }

  /* randomEntry : methode utilitaire sortant une entrée au hasard depuis un tableau ou un object */

  randomEntry(objectOrArray) {
    if(objectOrArray.constructor.name === 'Array'){
      let randomKey = Math.floor(Math.random() * objectOrArray.length)
      return objectOrArray[randomKey]
    }else if (objectOrArray.constructor.name === 'Object') {
      let properties = Object.keys(objectOrArray)
      let randomKey = Math.floor(Math.random() * properties.length)
      let randomProperty = properties[randomKey]
      return objectOrArray[randomProperty]
    }
  }

  /* weekMap, créé une "carte" de la semaine et y place les menus déjà consomés */
  weekMap() {
    let weekMap = {}
    for (let i = 0; i < 7; i++) {
      let nameDay = this.nameDays[i]
      weekMap[nameDay] = {}
      if(this.uptake[nameDay] !== undefined){
        for (let mealKey in this.uptake[nameDay]) {
          weekMap[nameDay][mealKey] = this.uptake[nameDay][mealKey]
          this.incrementTotals(nameDay, this.uptake[nameDay][mealKey])
        }
      }
    }
    return weekMap
  }

  debug() {
    console.log('---------- DEBUG ----------')
    console.log('Recommendations (reco) : ', this.reco)
    console.log('Portions par repas (pattern) : ', this.pattern)
    console.log('Déjà mangé cette semaine (uptake) : ', this.uptake)
    console.log('Totaux par jour et semaine (totalsWeek) : ', this.totalsWeek)
    console.log('Propositions, jour par jour (weekMap) : ')
    for (var day in this.weekMap) {
      console.log(day, this.weekMap[day])
    }
  }


}