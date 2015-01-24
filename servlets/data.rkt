#lang racket

(require db)

; Overall representation of our virtual bulletin board
(struct board (db))

; A category is, for the moment, just its board and id
(struct category (board id))

; A particular post carries along an associated board and a unique id
(struct post (board id))

; Initialize the board from the DB, creating it if needed.
(define (initialize-board! home)
  (define db (sqlite3-connect #:database home #:mode 'create))
  (initialize-tables db)
  (board db))

; Initialize database tables if not present
(define (initialize-tables db)
  (unless (table-exists? db "posts")
    (query-exec db 
		(string-append "CREATE TABLE posts "
			       "(id INTEGER PRIMARY KEY, category INTEGER, "
			       "title TEXT, body TEXT, email TEXT)")))
  (unless (table-exists? db "categories")
    (query-exec db
		(string-append "CREATE TABLE categories "
			       "(id INTEGER PRIMARY KEY, name TEXT)"))))

; Check for the existence of a post / category in the DB
(define (post-exists? a-post)
  (if (query-maybe-row (board-db (post-board a-post))
		       "SELECT * FROM posts WHERE id = ?"
		       (post-id a-post))
      #t
      #f))

(define (category-exists? a-category)
  (if (query-maybe-row (board-db (category-board a-category))
		       "SELECT * FROM categories WHERE id = ?"
		       (category-id a-category))
      #t
      #f))

; The following functions extract information on a post
(define (post-category a-post)
  (category (post-board a-post)
	    (query-value (board-db (post-board a-post))
			 "SELECT category FROM posts WHERE id = ?"
			 (post-id a-post))))

(define (post-title a-post)
  (query-value (board-db (post-board a-post))
	       "SELECT title FROM posts WHERE id = ?"
	       (post-id a-post)))

(define (post-body a-post)
  (query-value (board-db (post-board a-post))
	       "SELECT body FROM posts WHERE id = ?"
	       (post-id a-post)))

(define (post-email a-post)
  (query-value (board-db (post-board a-post))
	       "SELECT email FROM posts WHERE id = ?"
	       (post-id a-post)))

; These extract info on a board
(define (board-posts a-board)
  (map (lambda (id) (post a-board id))
       (query-list (board-db a-board)
		   "SELECT id FROM posts")))

(define (board-categories a-board)
  (map (lambda (id) (category a-board id))
       (query-list (board-db a-board)
		   "SELECT id FROM categories")))
  
; Extract corresponding info on categories
(define (category-name a-category)
  (query-value (board-db (category-board a-category))
	       "SELECT name FROM categories WHERE id = ?"
	       (category-id a-category)))

(define (category-posts a-category)
  (map (lambda (id) (post (category-board a-category) id))
       (query-list (board-db (category-board a-category))
		   "SELECT id FROM posts WHERE category = ?"
		   (category-id a-category))))

; Add a category to a board
(define (insert-category! a-board name)
  (query-exec (board-db a-board)
	      "INSERT INTO categories (name) VALUES (?)"
	      name))

; Add a new post
(define (insert-post! a-board category title body email)
  (query-exec (board-db a-board)
	      (string-append "INSERT INTO posts (category, title, "
			     "body, email) VALUES (?, ?, ?, ?)")
	      (category-id category) title body email))

(provide board? board-posts board-categories insert-category!
	 category? category category-exists? category-id
	 category-name category-posts
	 post? post post-exists? post-id post-category
	 post-title post-body post-email
	 initialize-board!)
