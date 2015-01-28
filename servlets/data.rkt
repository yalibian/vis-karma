#lang racket

; 实现功能： 维护 两个　json 文件： relation / karma
; 对relation karma 从 文件中读取到内存
; 更新信息到文件中
;


(require json
         racket/file)

(provide (all-defined-out))

; file-path -> js-expr
(define (read-json-from-file file-path)
  (string->jsexpr (file->string file-path)))

; write js-expression into a file
(define (write-json-to-file file-path js-expr)
  (call-with-output-file file-path
    (lambda (out)
      (write (jsexpr->string js-expr) out))
    #:exists 'replace))



;;--------------------------------------------------------------;;
;; relation
;;--------------------------------------------------------------;;

(define relation-path "data/relation.json")

(define RELATION (read-json-from-file relation-path))

(define (update-relation js-expr)
  (set! RELATION js-expr)
  (write-json-to-file karma-path RELATION))



;;--------------------------------------------------------------;;
;; karma
;;--------------------------------------------------------------;;

(define karma-path "data/karma.json")

(define KARMA (read-json-from-file karma-path))

(define (update-karma js-expr)
  (set! KARMA js-expr)
  (write-json-to-file karma-path KARMA))
