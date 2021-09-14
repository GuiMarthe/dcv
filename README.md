# dcv - desafio comanda virtual


O sistema consistem em criar uma order que pode possuir 3 estados. Por padrão, assim que criado, ele é 'preparing'(é assim que chega pra cozinha) que pode  marcar como 'ready' assim que estiver pronto. Cada comanda chega com o nome do cliente que fez. O cliente escolhe como pagar, Cartão de crédito, debito ou dinheiro. Assim que pagar, acontece o checkout, e por fim o ultimo estado 'finish'

Stacks usadas NodeJs(NestJs), MongoDB, ReactJs e Docker



é preciso instalar o docker-compose

Use o comando: docker-compose up para subir o  banco 

rode o comando yarn para instalar os modules

yarn start no backend para rodar




acesse o /kitchen para visualizar as comandas ativas
        /customer para criar uma comanda
       
