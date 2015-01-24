#lang web-server

(require web-server/templates)
;(require web-server/)

;(require "data.rkt")

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
   ;[("post" (integer-arg)) display-post]
   ))

(define (start request)
  (servlet-dispatch request))

(define (home-view request)
  (response/full
   200 #"Okay"
   (current-seconds) TEXT/HTML-MIME-TYPE
   empty
   (list (string->bytes/utf-8 (include-template "../static/index.html")))))

