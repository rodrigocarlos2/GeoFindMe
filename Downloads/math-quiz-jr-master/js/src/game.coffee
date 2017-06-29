Game =
  init: ->
    @storage = localStorage
    if (typeof(@storage.highestScore) == 'undefined')
      @storage.highestScore = 0
    @highestScore = parseInt(@storage.highestScore)
    @score = 0
    @updateScore()
    $('section').hide()
    $('section#start-game').show()
    $('a#start').click (ev) ->
      ev.preventDefault()
      Game.startGame()
    $('a#next-question').click (ev) ->
      ev.preventDefault()
      Game.nextQuestion()
    $('a#restart').click (ev) ->
      ev.preventDefault()
      Game.restart()
    Game.watchAnswering()
  startGame: ->
    @score = 0
    Game.updateScore()
    Game.nextQuestion()
  restart: ->
    Game.startGame()
  nextQuestion: ->
    $('section').hide()
    $('section#game').show()
    @factor_1 = @randomNumber(11)
    @factor_2 = @randomNumber(10)
    question = "#{@factor_1} x #{@factor_2}"
    $('#question').html(question)
    @answer = @factor_1*@factor_2
    options = [@answer, @randomNumber(110), @randomNumber(110), @randomNumber(110)]
    options = @shuffleArray(options)
    console.log options
    for i in [1..4]
      $("#option-#{i}").html(options[i-1])
      $("#option-#{i}")[0].dataset.val = options[i-1]
  randomNumber: (max) ->
    1 + parseInt(max*Math.random())
  shuffleArray: (arr) ->
    arr.sort -> 0.5 - Math.random()
  watchAnswering: ->
    $('.option-card').click ->
      val = parseInt($(@).find('.option')[0].dataset.val)
      if val == Game.answer
        Game.correctAnswer()
      else
        Game.wrongAnswer()
  updateScore: ->
    if Game.score > Game.highestScore
      Game.storage.highestScore = Game.score
      Game.highestScore = Game.score
    $('#highest-score').html(Game.highestScore)
    $('#score').html(Game.score)
  correctAnswer: ->
    @score++
    @updateScore()
    $('section').hide()
    $('section#correct-answer').show()
  wrongAnswer: ->
    $('section').hide()
    helpMsg = "#{Game.factor_1} x #{Game.factor_2} = #{Game.answer}"
    $('section#wrong-answer .help-msg').html(helpMsg)
    $('section#wrong-answer').show()


$ ->
  Game.init()
