document.querySelectorAll( '#burgerMenu input' ).forEach( el => {
    el.addEventListener( 'input', () => {
        el.value.length !== 0
            ? el.classList.add( 'filled' )
            : el.classList.remove( 'filled' )
    } )
} )
