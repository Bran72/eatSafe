document.querySelectorAll( '#SignInterface input' ).forEach( el => {
    el.addEventListener( 'input', () => {
        el.value.length !== 0
            ? el.classList.add( 'filled' )
            : el.classList.remove( 'filled' )
    } )
} )

const
    burger = document.getElementById( 'burger' ),
    signInterface = document.getElementById( 'SignInterface' )

function toggleIcon( init ) {
    if ( init !== true )
        burger.classList.toggle( 'actif' )
    burger.classList.contains( 'actif' )
        ? burger.textContent = "✖️"
        : burger.textContent = "☰"
}
toggleIcon( true )

burger.addEventListener( "click", toggleIcon )

signInterface.addEventListener( 'submit', e => {
    e.preventDefault()
    localStorage.setItem( 'connected', true )
    connectivity()
} )

document.addEventListener( 'DOMContentLoaded', connectivity )

function connectivity() {
    if ( !!localStorage.getItem( 'connected' ) === true )
        signInterface.style.bottom = '100%'
        signInterface.style.display = 'none'
}

document.getElementById( 'disconnect' ).addEventListener( 'click', () => {
    localStorage.setItem( 'connected', false )
    signInterface.style.bottom = '0%'
    signInterface.style.display = 'block'
    setTimeout( toggleIcon, 500 )
} )
