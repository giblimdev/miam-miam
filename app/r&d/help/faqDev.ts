//@/app/r&d/help/faqDev

/*
en accord avec mon schema.prisma
cree des question / reponse
pour 
- illustrer les fonctionnalité de la db et les fichiers,page,composant mise en oeuvr
- illustrer les deature de l'app et leur developppement.

*/

interface FAQDEV {
id: string;
feature: string;
question: String;
answer: string;
file : File[]
}

interface File{
id: string; 
Path : string;
statue : string; // CREATE | DONE | INPROD ... 
role : string;
import : string; // liste des fonction, constante impotées et leur path separé par ";"
useby : string; // fichiers et  et leur path separé par ";"
relatifFiles: string; // ensemble des fichier concerné zt leurs path
}