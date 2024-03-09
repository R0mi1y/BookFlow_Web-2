package com.room.bookflow.activities;

import androidx.annotation.NonNull;
import androidx.appcompat.app.ActionBarDrawerToggle;
import androidx.appcompat.app.AppCompatActivity;
import androidx.appcompat.widget.Toolbar;
import androidx.core.view.GravityCompat;
import androidx.drawerlayout.widget.DrawerLayout;

import android.os.Bundle;
import android.view.MenuItem;
import android.widget.Toast;

import com.room.bookflow.R;
import com.room.bookflow.fragments.NotificationsFragment;
import com.room.bookflow.fragments.ProfileFragment;

import com.google.android.material.navigation.NavigationView;


public class MainActivity extends AppCompatActivity implements NavigationView.OnNavigationItemSelectedListener{

    DrawerLayout drawerLayout;
    Toolbar toolbar;


    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        toolbar = findViewById(R.id.toolbar);

        //Substituir a action bar padrão do android pela toolbar criada na activity_main
        setSupportActionBar(toolbar);

        drawerLayout = findViewById(R.id.drawer_layout);

        // Pegando a navigationView da activit_main (menu com os itens e background e logo)
        NavigationView navigationView = findViewById(R.id.nav_view);

        //metodo que está configurando para lidar com eventos de seleção de itens de menu na navigaiton View
        //indica que a mainActivity implementa essa interface
        navigationView.setNavigationItemSelectedListener(this);

        // ActionBarDraweToggle é uma classe que fornece integração entre o drawerLayout e a ActionBar, facilita a adicão do icone
        // Parametros activity que esta sendo usada, o layout do menu lateral, toolbar instancia da toolbar , id de recurso da string que sera exibido na barra de ferramentas quando o menu estiver fechado e aberto mostrando os icones
        ActionBarDrawerToggle toggle = new ActionBarDrawerToggle(this, drawerLayout, toolbar, R.string.open_nav, R.string.close_nav);

        // Implementa a inteface DrawerListener que fornecem metodos para serem chamados quando o estado do DrawerLayout muda
        // escuta os eventos para atualizar a aparencia do icone da gaveta na barra de ferramentas
        drawerLayout.addDrawerListener(toggle);

        // sincroniza o estado do ActionBarDrawerToggle apos a configuração
        // garante que o icone na barra de ferramentas reflete o estado atual do DrawerLayout(aberto ou fechado)
        toggle.syncState();


        // verifica se o estado da atividade foi salvo (preservado) após uma possível recriação da atividade,

        //verifica se o objeto savedInstanceState é nulo. Objeto Bundle que contam dados que podem ser usados para restaurar o estado da atividade a partir de uma instancia anterior


        if (savedInstanceState == null) {
            //verifica se o objeto savedInstanceState é nulo. Objeto Bundle que contam dados que podem ser usados para restaurar o estado da atividade a partir de uma instancia anterior

            // se for nulo o objeto esta sendo criado pela primeira vez
            // substitui dinamicamente o fragment_container para a HomeFragment
            getSupportFragmentManager().beginTransaction().replace(R.id.fragment_container, new ProfileFragment()).commit();

            //marca o item homeFragment como selecionado na navigationViee
            navigationView.setCheckedItem(R.id.notifications);
        }

    }
    @Override
    public boolean onNavigationItemSelected(@NonNull MenuItem item) {
        int itemSelecionado = item.getItemId();

        if(itemSelecionado == R.id.notifications){
            getSupportFragmentManager().beginTransaction().replace(R.id.fragment_container, new NotificationsFragment()).commit();
        }else if(itemSelecionado == R.id.loan){
            getSupportFragmentManager().beginTransaction().replace(R.id.fragment_container, new ProfileFragment()).commit();
        }else if(itemSelecionado == R.id.nav_logout){
            Toast.makeText(this, "Logout!", Toast.LENGTH_SHORT).show();
        }

        // Iapós o usuário selecionar um item no menu lateral, o código fecha o menu, proporcionando uma experiência de navegação mais fluida.
        drawerLayout.closeDrawer(GravityCompat.START);
        return true;
    }

    @Override
    public void onBackPressed() {
        // Verifica se o menu está aberto se estiver fecha caso precionado o botão de voltar do celular
        if (drawerLayout.isDrawerOpen(GravityCompat.START)) {
            drawerLayout.closeDrawer(GravityCompat.START);
        } else {
            super.onBackPressed();
        }
    }
}