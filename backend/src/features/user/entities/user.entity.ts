export interface UserProps {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  dateOfBirth: Date;
  createdAt?: Date;
}

export class User {
  public readonly id: string;
  public readonly email: string;
  public readonly firstName: string;
  public readonly lastName: string;
  public readonly dateOfBirth: Date;
  public readonly createdAt: Date;

  constructor({ id, email, firstName, lastName, dateOfBirth, createdAt }: UserProps) {
    this.id = id;
    this.email = email;
    this.firstName = firstName;
    this.lastName = lastName;
    this.dateOfBirth = dateOfBirth;
    this.createdAt = createdAt ?? new Date();
  }
}
