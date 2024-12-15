$(document).ready(function() {

    var menuChosen
    var randWord
    var hiddenLetter
    var guessWord = []
    var guessWordstring = ''

  

    var lives = 10
    var wordGuessed = 0
    $('.word-guess').text(wordGuessed)
    for (var i = 0; i < lives; i++) { 
        $('.lives-wrapper').append(`<i class="fa-solid fa-heart"></i>`)

    }
    function randomIndexHide(indexNum,letters){
        var hideIndex = []
        while (hideIndex.length < indexNum){
            var randomIndex = Math.floor(Math.random() * letters.length)
            if(!hideIndex.includes(randomIndex) && randomIndex != 0){
                hideIndex.push(randomIndex)
            }
        }
        return hideIndex
    }

    function generateRandWord(level,hidden){
        $('.guess-input-wrapper,.word-clue').html('')
        guessWordstring = ''
        guessWord.length = 0
        guessWord
        $.ajax({
            url: 'https://random-word-api.herokuapp.com/word?length='+level,
            method: 'GET',       
            success: function(data) {
                  randWord = data[0]

                    let hiddenIndex = randomIndexHide(hidden,randWord)
                   
                    randWord.split('').forEach(function(letter,index){
                      
                        guessWord.push(letter.toUpperCase())
                        guessWordstring += letter.toUpperCase()
                        if(hiddenIndex.includes(index)){
                            $('.guess-input-wrapper').append(`<input class="guess-input text-uppercase" data-indexnum="${index}">`)
                        }
                        else{
                            $('.guess-input-wrapper').append(`<input class="guess-input text-uppercase" value="${letter}" readonly>`)
                        }
                        
                    })
                    getWordClue(guessWordstring,level,hidden)
                    

            },
            error: function(err) {
                console.log('Error:', err);
            }
        });

      
    }

    function getWordClue(word,level,hidden){
        $.ajax({
            url: `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`,
            method: 'GET',
          
            success: function(data) {
                var definitions = [] 
                data.forEach(function(item) {
                     item.meanings.forEach(function(meaning) { 
                        meaning.definitions.forEach(function(def) { 
                            $('.word-clue').append(def.definition+"; "); 
                        })
                    })
                })
                $('.wordguess-box').removeClass('d-none')
                $('.guessword-loader').addClass('d-none')
                
            },
            error: function(err) {
                generateRandWord(level,hidden)
                $('.wordguess-box').addClass('d-none')
                $('.guessword-loader').removeClass('d-none')
            }
        })

    }

    function checkMenuChosen(chosen){
        let randomWordNum = Math.floor(Math.random() * (8 - 5)) + 5
        if(chosen == 'easy'){
          
            hiddenLetter = 2
        }
        else if(chosen == 'medium'){
            randomWordNum = Math.floor(Math.random() * (9 - 6)) + 6
            hiddenLetter = 3
        }
        else{
         
            hiddenLetter = 5
            randomWordNum = Math.floor(Math.random() * (15 - 8)) + 8
        }

        generateRandWord(randomWordNum,hiddenLetter)
    }

    function resetAll(){
        lives = 10
        guessWord.length = 0
        guessWordstring = ''
        wordGuessed = 0
        $('.word-guess').text(wordGuessed)
        $('.wordguess-box').addClass('d-none')
        $('.guessword-loader').removeClass('d-none')
        $('.lives-wrapper').html('')
        for (var i = 0; i < lives; i++) { 
           
            $('.lives-wrapper').append(`<i class="fa-solid fa-heart"></i>`)
    
        }
    }

    $('.menu-btn').on('click',function(){
        menuChosen = $(this).data('type')
        wordGuessed = 0
        checkMenuChosen(menuChosen)
        $('.typeChosen').text(menuChosen+' level')
        $('.menu-wrapper').addClass('d-none')
        $('.game-wrapper').removeClass('d-none')
        $('.wordguess-box').addClass('d-none')
        $('.guessword-loader').removeClass('d-none')
    })


    $(document).on('input','.guess-input',function(){
        var guessIndex = $(this).data('indexnum')
        var userGuess = $(this).val().toUpperCase()
        var userGuessString = ''

        $('.guess-input').each(function(){
            userGuessString+=$(this).val().toUpperCase()
        })


        if($(this).val().length > 1){ 
            $(this).val($(this).val().slice(0, 1))
        }

        //CHECK IF INPUT CORRECT AND CHANGE BORDER
        if (userGuess == guessWord[guessIndex]){
            $(this).css('border','1px solid green')
        }
        else if($(this).val().length < 1){
            $(this).css('border','1px solid gray')
        }
        else{
            $(this).css('border','1px solid red')
           
            lives--
            $('.fa-solid.fa-heart').last().removeClass('fa-solid').addClass('fa-regular')
        }

        //CHECK LIVES LEFT AND CHECK IF WIN
        if(userGuessString == guessWordstring && lives > 0){
            wordGuessed++
            if(lives <= 9){
                lives++
                
            }
            $('.fa-regular.fa-heart').first().removeClass('fa-regular').addClass('fa-solid')
            $('.word-guess').text(wordGuessed)
            $('#next-wordModal').modal('toggle')
           
          
                
            
           
        }
        else if(lives == 0){
            $('#no-livesModal').modal('toggle')
        }

    })

    $('.next-btn').on('click',function(){
        guessWord.length = 0
        guessWordstring = ''
        checkMenuChosen(menuChosen)
        $('#next-wordModal').modal('hide')
        $('.wordguess-box').addClass('d-none')
        $('.guessword-loader').removeClass('d-none')
    })

    $('.back-toMenu-btn').on('click',function(){
        $('.menu-wrapper').removeClass('d-none')
        $('.game-wrapper').addClass('d-none')
        $('#no-livesModal').modal('hide')
        resetAll()
    })
    

    $('.play-again-btn').on('click',function(){
        checkMenuChosen(menuChosen)
        $('#no-livesModal').modal('hide')
        resetAll()
    })
});
