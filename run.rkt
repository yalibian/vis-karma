#lang racket

(require "servlets/main.rkt"
	 web-server/servlet-env)

(serve/servlet start
;               #:launch-brower? #t
               #:command-line? #t
               #:stateless? #t
               #:port 8888
               #:extra-files-paths (list (build-path "./static/"))
               #:servlet-regexp #rx"")

; the static file path
;(static-files-path "static")

