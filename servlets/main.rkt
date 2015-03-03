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
   ;[("") home-view]
   [("get-relation") get-relation]
   [("set-relation") set-relation]
   [("get-karma") get-karma]
   [("set-karma") set-karma]
   ;[else hello-world]
   ))

; 每个 http 请求 都会经过这里，static的也一样
(define (start request)
  ;(display "in start request")
  (servlet-dispatch request))

(define (home-view request)
  (display "home-view")
  (newline)
  (response/full
   200 #"Okay"
   (current-seconds) TEXT/HTML-MIME-TYPE
   empty
   (list (string->bytes/utf-8 (include-template "../index.html")))))


; response relaiton.json
(define (get-relation request)
  (display "get-relation")
  (response/json RELATION))

; update relation.json
(define (set-relation request)
  (display "set-relation")
  'test-now)

; response karma.json
(define (get-karma request)
  (display "get-karma")
  (response/json KARMA))

; update karma.json
(define (set-karma request)
  (display "set-karma")
  'test-now)

; response a http body of json file
(define (response/json js-expr)
  (display 'in-response/json)
  (response/full 200 #"Okay"
                 (current-seconds) #"application/json"
                 empty
                 (list (jsexpr->string js-expr))))


