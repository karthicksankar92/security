<?php

/* Chat line is used for the chat entries */

class ChatLine extends ChatBase{
	
	protected $text = '', $author = '', $gravatar = '', $ciphertext='',$sendto = '';
	
	public function save(){
		DB::query("
			INSERT INTO webchat_lines (author, gravatar, text, ciphertext,sendto)
			VALUES (
				'".DB::esc($this->author)."',
				'".DB::esc($this->gravatar)."',
				'".DB::esc($this->text)."',
				'".DB::esc($this->ciphertext)."',
				'".DB::esc($this->sendto)."'

		)");
		
		// Returns the MySQLi object of the DB class
		
		return DB::getMySQLiObject();
	}
}

?>