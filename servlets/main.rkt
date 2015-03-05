#lang web-server

(require web-server/templates
         json
         net/uri-codec
         net/url)
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
   [("get-relation") get-relation]
   [("set-relation") set-relation]
   [("get-karma") get-karma]
   [("set-karma") #:method "post" set-karma]))

; 每个 http 请求 都会经过这里，static的也一样
(define (start request)
  ;(display "in start request")
  ;(display "---------------------------")
  ;(newline)
  ;(display (request-method request))
  ;(newline)
  ;(display (url->string (request-uri request)))
  ;(newline)
  ;(display (request-post-data/raw))
  ;(newline)
  ;(newline)
  ;(newline)
  (servlet-dispatch request))


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
  (display "----------------------")
  (newline)
  (display "set-karma")
  (newline)
  (display (request-post-data/raw request))
  (newline)
  (response/full 200 #"OK"
                 (current-seconds)
                 TEXT/HTML-MIME-TYPE
                 empty
                 (list #"<html><body>Hello, World!</body></html>")))

; response a http body of json file
(define (response/json js-expr)
  (display 'in-response/json)
  (response/full 200 #"Okay"
                 (current-seconds) #"application/json"
                 empty
                 (list (jsexpr->string js-expr))))

