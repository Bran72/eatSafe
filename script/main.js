document.querySelectorAll( '#SignInterface input' ).forEach( el => {
    el.addEventListener( 'input', () => {
        el.value.length !== 0
            ? el.classList.add( 'filled' )
            : el.classList.remove( 'filled' )
    } )
} )

const burger = document.getElementById( "burger" );

function toggleIcon() {
    burger.classList.contains( 'actif' )
        ? burger.textContent = "⛌"
        : burger.textContent = "☰"
}
toggleIcon()

burger.addEventListener( "click", function () {
    burger.classList.toggle( 'actif' )
    toggleIcon()
} )
