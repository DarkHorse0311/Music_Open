package database

import (
	"path/filepath"
)

type File struct {
	Db         *Database `json:"-"`
	ID         int64     `json:"id"`
	Folder_id  int64     `json:"folder_id"`
	Foldername string    `json:"foldername"`
	Filename   string    `json:"filename"`
	Filesize   int64     `json:"filesize"`
}

type Folder struct {
	Db         *Database `json:"-"`
	ID         int64     `json:"id"`
	Folder     string    `json:"-"`
	Foldername string    `json:"foldername"`
}

type User struct {
	ID       int64  `json:"id"`
	Username string `json:"username"`
	Password string `json:"-"`
	Role     int64  `json:"role"`
	AvatarId int64  `json:"avatar_id"`
}

func (f *File) Path() (string, error) {
	folder, err := f.Db.GetFolder(f.Folder_id)
	if err != nil {
		return "", err
	}
	return filepath.Join(folder.Folder, f.Filename), nil
}
