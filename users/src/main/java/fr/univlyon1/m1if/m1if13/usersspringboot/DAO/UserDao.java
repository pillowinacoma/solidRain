package fr.univlyon1.m1if.m1if13.usersspringboot.DAO;

import fr.univlyon1.m1if.m1if13.usersspringboot.model.User;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.Optional;
import java.util.Set;

public class UserDao implements Dao<User>{

    private ArrayList<User> users = new ArrayList<User>();

    public UserDao(){
        users.add(new User("user1", "pwd1"));
        users.add(new User("user2", "pwd2"));
        users.add(new User("MFDOOM", "villain"));
    }


    @Override
    public Optional<User> get(String id) {
        for(User u : users){
            if(u.getLogin().equals(id))
                return Optional.of(u);
        }
        return Optional.empty();
    }

    @Override
    public Set<String> getAll() {
        HashSet<String> res = new HashSet<String>();
        for (User u : users)
            res.add(u.getLogin());

        return res;
    }

    @Override
    public void save(User user) {
        users.add(user);
    }

    @Override
    public void update(User user, String[] params) {
        int index = users.indexOf(user);
        users.get(index).setLogin(params[0]);
        users.get(index).setLogin(params[1]);
    }

    @Override
    public void delete(User user) {
        users.remove(user);
    }
}
