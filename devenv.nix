{pkgs, ...}: let
  node = pkgs.nodejs_20;
in {
  env.LANG = "en_US.UTF-8";
  dotenv.enable = false;

  packages = with pkgs;
    [
      node
nodePackages.typescript-language-server
    tailwindcss-language-server
      yarn
    ];
  languages.javascript.enable = true;
} 
