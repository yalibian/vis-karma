#lang web-server

(require web-server/templates
         json)
;(require web-server/)

(require "data.rkt")

(provide interface-version
         start
         servlet-dispatch
	 servlet-url)


(define interface-version 'stateless)

;(define the-board (initialize-board!
;		   (build-path (current-directory)
;			       "board.db")))


; Setup request handlers for various URLs
(define-values (servlet-dispatch servlet-url)
  (dispatch-rules
   [("") home-view]
   [("/get-relation") get-relation]
   [("/set-relation") set-relation]
   [("/get-karma") get-karma]
   [("/set-karma") set-karma]

   ;[("post" (integer-arg)) display-post]
   ))

(define (start request)
  (servlet-dispatch request))

(define (home-view request)
  (response/full
   200 #"Okay"
   (current-seconds) TEXT/HTML-MIME-TYPE
   empty
   (list (string->bytes/utf-8 (include-template "../index.html")))))


; response relaiton.json
(define (get-relation request)
  (response/json RELATION))

; update relation.json
(define (set-relation request)
  'test-now)

; response karma.json
(define (get-karma request)
  (response/json KARMA))

; update karma.json
(define (set-karma request)
  'test-now)

; 不知道是 js->string 还是 js->byte
(define (response/json js-expr)
  (response/full 200 #"Okay"
                 (current-seconds) #"application/json"
                 empty
                 (list (jsexpr->string js-expr))))
