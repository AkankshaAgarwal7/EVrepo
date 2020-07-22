<?php
 $first_name=$_POST['first_name'];
  $last_name=$_POST['last_name'];
   $mobile_no=$_POST['mobile_no'];
    $email=$_POST['email'];
	 $password=$_POST['password'];
	 $password2=$_POST['pass2'];
	  $gender=$_POST['gender'];
	  if(!empty($first_name)||!empty($last_name)||!empty($mobile_no)||!empty($email)||!empty($password)||!empty($gender))
	  {
		  $host="localhost";
		  $dbusername="root";
		  $dbpassword="";
		  $dbname="dbname";
		  $conn=mysqli_connect($host,$dbusername,$dbpassword,$dbname);
		  if(!$conn){
			  echo "failed";
		  }
		  else{
			 // $SELECT="SELECT email From register Where email = ? Limit 1";
			  
//$INSERT="INSERT Into register(email,first_name,last_name,mobile_no,password,gender)
			  //values(?,?,?,?,?,?)";
			  /*$stmt=$conn->prepare($SELECT);
			  $stmt->bind_param("s",$email);
			  $stmt->execute();
			  $stmt->bind_result($email);
			  $stmt->store_result();
			  $rnum=$stmt->num_rows;*/
			  
			  
			  
				  $query="INSERT INTO register(`fname`, `lname`, `mno`, `email`, `pass`, `pass2`, `gender`) VALUES ('$first_name','$last_name','$mobile_no','$email','$password','$password2','$gender')";
				  $result = mysqli_query($conn,$query);
				  if(!$result)
					  echo "failed to execue query";
				  else
				  echo "you are registered successfully";
			 /* }
			  else
			  {
				  echo " Someone Already registered with this email";
			  }
              $stmt->close();
              $conn->close();	
		  }			  
	  }
	  else
	  {
		  echo "All fields are required";
		  die();
	  }*/
	  }
	  }
?>