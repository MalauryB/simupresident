export interface Database {
  public: {
    Tables: {
      parti: {
        Row: {
          tag: string;
          nom: string;
          actif: boolean;
          couleur_fond: string | null;
          couleur_texte: string | null;
          couleur_accent: string | null;
          couleur_graphique: string | null;
        };
        Insert: {
          tag: string;
          nom: string;
          actif?: boolean;
          couleur_fond?: string | null;
          couleur_texte?: string | null;
          couleur_accent?: string | null;
          couleur_graphique?: string | null;
        };
        Update: {
          tag?: string;
          nom?: string;
          actif?: boolean;
          couleur_fond?: string | null;
          couleur_texte?: string | null;
          couleur_accent?: string | null;
          couleur_graphique?: string | null;
        };
        Relationships: [];
      };
      candidat: {
        Row: {
          id: string;
          parti_tag: string;
          indice_variante: number;
          nom: string;
          initiales: string | null;
          sonde_individuellement: boolean;
          groupe_sondage: string | null;
          attractivite: number;
          tendance: number;
          ideologie_gauche: number;
          ideologie_centre: number;
          ideologie_droite: number;
          taux_barrage: number;
          start_agrege: number;
          start_debiaise: number;
          start_personnalise: number;
          photo_url: string | null;
        };
        Insert: {
          id: string;
          parti_tag: string;
          indice_variante?: number;
          nom: string;
          initiales?: string | null;
          sonde_individuellement?: boolean;
          groupe_sondage?: string | null;
          attractivite?: number;
          tendance?: number;
          ideologie_gauche?: number;
          ideologie_centre?: number;
          ideologie_droite?: number;
          taux_barrage?: number;
          start_agrege?: number;
          start_debiaise?: number;
          start_personnalise?: number;
          photo_url?: string | null;
        };
        Update: {
          id?: string;
          parti_tag?: string;
          indice_variante?: number;
          nom?: string;
          initiales?: string | null;
          sonde_individuellement?: boolean;
          groupe_sondage?: string | null;
          attractivite?: number;
          tendance?: number;
          ideologie_gauche?: number;
          ideologie_centre?: number;
          ideologie_droite?: number;
          taux_barrage?: number;
          start_agrege?: number;
          start_debiaise?: number;
          start_personnalise?: number;
          photo_url?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "candidat_parti_tag_fkey";
            columns: ["parti_tag"];
            referencedRelation: "parti";
            referencedColumns: ["tag"];
            isOneToOne: false;
          },
        ];
      };
      source_sondage: {
        Row: {
          type: string;
          libelle: string;
          description: string | null;
          icone: string | null;
        };
        Insert: {
          type: string;
          libelle: string;
          description?: string | null;
          icone?: string | null;
        };
        Update: {
          type?: string;
          libelle?: string;
          description?: string | null;
          icone?: string | null;
        };
        Relationships: [];
      };
      simulation: {
        Row: {
          id: string;
          source_sondage_type: string;
          date_creation: string;
          nb_simulations: number;
          nb_jours: number;
          niveau_confiance: number;
        };
        Insert: {
          id?: string;
          source_sondage_type: string;
          date_creation?: string;
          nb_simulations?: number;
          nb_jours?: number;
          niveau_confiance?: number;
        };
        Update: {
          id?: string;
          source_sondage_type?: string;
          date_creation?: string;
          nb_simulations?: number;
          nb_jours?: number;
          niveau_confiance?: number;
        };
        Relationships: [
          {
            foreignKeyName: "simulation_source_sondage_type_fkey";
            columns: ["source_sondage_type"];
            referencedRelation: "source_sondage";
            referencedColumns: ["type"];
            isOneToOne: false;
          },
        ];
      };
      config_simulation_candidat: {
        Row: {
          simulation_id: string;
          parti_tag: string;
          indice_variante: number;
          point_depart: number;
          attractivite: number;
          tendance: number;
          taux_barrage: number;
          ideologie_g: number;
          ideologie_c: number;
          ideologie_d: number;
        };
        Insert: {
          simulation_id: string;
          parti_tag: string;
          indice_variante?: number;
          point_depart?: number;
          attractivite?: number;
          tendance?: number;
          taux_barrage?: number;
          ideologie_g?: number;
          ideologie_c?: number;
          ideologie_d?: number;
        };
        Update: {
          simulation_id?: string;
          parti_tag?: string;
          indice_variante?: number;
          point_depart?: number;
          attractivite?: number;
          tendance?: number;
          taux_barrage?: number;
          ideologie_g?: number;
          ideologie_c?: number;
          ideologie_d?: number;
        };
        Relationships: [
          {
            foreignKeyName: "config_simulation_candidat_simulation_id_fkey";
            columns: ["simulation_id"];
            referencedRelation: "simulation";
            referencedColumns: ["id"];
            isOneToOne: false;
          },
          {
            foreignKeyName: "config_simulation_candidat_parti_tag_fkey";
            columns: ["parti_tag"];
            referencedRelation: "parti";
            referencedColumns: ["tag"];
            isOneToOne: false;
          },
        ];
      };
      resultat_candidat: {
        Row: {
          simulation_id: string;
          parti_tag: string;
          p_qualification_2nd_tour: number;
          p_victoire: number;
          valeur_finale_moyenne: number;
        };
        Insert: {
          simulation_id: string;
          parti_tag: string;
          p_qualification_2nd_tour?: number;
          p_victoire?: number;
          valeur_finale_moyenne?: number;
        };
        Update: {
          simulation_id?: string;
          parti_tag?: string;
          p_qualification_2nd_tour?: number;
          p_victoire?: number;
          valeur_finale_moyenne?: number;
        };
        Relationships: [
          {
            foreignKeyName: "resultat_candidat_simulation_id_fkey";
            columns: ["simulation_id"];
            referencedRelation: "simulation";
            referencedColumns: ["id"];
            isOneToOne: false;
          },
          {
            foreignKeyName: "resultat_candidat_parti_tag_fkey";
            columns: ["parti_tag"];
            referencedRelation: "parti";
            referencedColumns: ["tag"];
            isOneToOne: false;
          },
        ];
      };
      trajectoire: {
        Row: {
          simulation_id: string;
          parti_tag: string;
          jour: number;
          valeur_moyenne: number;
          borne_haute_ic75: number;
          borne_basse_ic75: number;
        };
        Insert: {
          simulation_id: string;
          parti_tag: string;
          jour: number;
          valeur_moyenne?: number;
          borne_haute_ic75?: number;
          borne_basse_ic75?: number;
        };
        Update: {
          simulation_id?: string;
          parti_tag?: string;
          jour?: number;
          valeur_moyenne?: number;
          borne_haute_ic75?: number;
          borne_basse_ic75?: number;
        };
        Relationships: [
          {
            foreignKeyName: "trajectoire_simulation_id_fkey";
            columns: ["simulation_id"];
            referencedRelation: "simulation";
            referencedColumns: ["id"];
            isOneToOne: false;
          },
          {
            foreignKeyName: "trajectoire_parti_tag_fkey";
            columns: ["parti_tag"];
            referencedRelation: "parti";
            referencedColumns: ["tag"];
            isOneToOne: false;
          },
        ];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}
