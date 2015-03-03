#lang racket

(require "servlets/main.rkt"
	 web-server/servlet-env)

;(display (list (build-path (current-directory) "static/css")))
(serve/servlet start
;               #:launch-brower? #t
               #:command-line? #t
               #:stateless? #t
               #:port 9999
               #:extra-files-paths (list (build-path (current-directory) "static")
                                         (build-path (current-directory) "static/css"))
               ;#:extra-files-paths (list (build-path "~/code/racket/karma-vis/static"))
               #:servlet-regexp #rx""
               )

; no static-files-path in servlet-env
; the static file path
;(static-files-path "static")

