<?php

class ChatUser extends ChatBase{
	
	protected $name = '', $gravatar = '', $email ='';
	
	public function save(){
		
		DB::query("
			INSERT INTO webchat_users (name, gravatar,email)
			VALUES (
				'".DB::esc($this->name)."',
				'".DB::esc($this->gravatar)."',
				'".DB::esc($this->email)."'

		)");
		
		return DB::getMySQLiObject();
	}
	
	public function update(){
		DB::query("
			INSERT INTO webchat_users (name, gravatar,email)
			VALUES (
				'".DB::esc($this->name)."',
				'".DB::esc($this->gravatar)."',
				'".DB::esc($this->email)."'

			) ON DUPLICATE KEY UPDATE last_activity = NOW()");
	}
}

?>